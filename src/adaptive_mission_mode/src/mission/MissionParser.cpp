#include "adaptive_mission_mode/mission/MissionParser.hpp"

#include <algorithm>
#include <cctype>
#include <cmath>
#include <limits>
#include <optional>
#include <stdexcept>
#include <string>

#include <px4_ros2/mission/mission.hpp>

namespace adaptive_mission_mode
{
namespace
{
constexpr int kMavCmdNavWaypoint = 16;
constexpr int kMavCmdNavRtl = 20;
constexpr int kMavCmdNavLand = 21;
constexpr int kMavCmdNavTakeoff = 22;
constexpr int kMavCmdDoChangeSpeed = 178;

constexpr int kMavFrameGlobal = 0;
constexpr int kMavFrameGlobalRelativeAlt = 3;
constexpr int kMavFrameGlobalInt = 5;
constexpr int kMavFrameGlobalRelativeAltInt = 6;

bool isFinite(double value)
{
  return std::isfinite(value);
}

std::string toLower(std::string text)
{
  std::transform(
    text.begin(),
    text.end(),
    text.begin(),
    [](unsigned char character)
    {
      return static_cast<char>(std::tolower(character));
    });

  return text;
}

bool hasNumber(const nlohmann::json & json, const char * key)
{
  return json.is_object() && json.contains(key) && json.at(key).is_number();
}

bool hasString(const nlohmann::json & json, const char * key)
{
  return json.is_object() && json.contains(key) && json.at(key).is_string();
}

double getNumberOrNan(const nlohmann::json & json, const char * key)
{
  if (!hasNumber(json, key)) {
    return std::numeric_limits<double>::quiet_NaN();
  }

  return json.at(key).get<double>();
}

std::string buildItemId(const nlohmann::json & item, const char * prefix, int fallbackIndex)
{
  if (hasString(item, "id")) {
    return item.at("id").get<std::string>();
  }

  if (hasNumber(item, "seq")) {
    return std::string(prefix) + std::to_string(item.at("seq").get<int>());
  }

  return std::string(prefix) + std::to_string(fallbackIndex);
}

bool isTokenBoundary(char character)
{
  return !std::isalnum(static_cast<unsigned char>(character)) &&
    character != '_' &&
    character != '.';
}

bool matchesToken(const std::string & text, size_t position, const std::string & token)
{
  if (position + token.size() > text.size()) {
    return false;
  }

  const bool hasLeftNeighbor = position > 0;
  const bool hasRightNeighbor = position + token.size() < text.size();

  if (hasLeftNeighbor && !isTokenBoundary(text[position - 1])) {
    return false;
  }

  if (hasRightNeighbor && !isTokenBoundary(text[position + token.size()])) {
    return false;
  }

  for (size_t index = 0; index < token.size(); ++index) {
    const auto source = static_cast<unsigned char>(text[position + index]);
    const auto target = static_cast<unsigned char>(token[index]);

    if (std::tolower(source) != std::tolower(target)) {
      return false;
    }
  }

  return true;
}

// JSON từ MAVLink đôi khi có NaN/Infinity, cần đổi về null trước khi parse.
std::string sanitizeJsonText(const std::string & text)
{
  std::string output;
  output.reserve(text.size());

  bool insideString = false;
  bool escaped = false;

  for (size_t index = 0; index < text.size();) {
    const char character = text[index];

    if (insideString) {
      output += character;

      if (escaped) {
        escaped = false;
      } else if (character == '\\') {
        escaped = true;
      } else if (character == '"') {
        insideString = false;
      }

      ++index;
      continue;
    }

    if (character == '"') {
      insideString = true;
      output += character;
      ++index;
      continue;
    }

    if (matchesToken(text, index, "nan")) {
      output += "null";
      index += 3;
      continue;
    }

    if (index + 1 < text.size() && text[index] == '-' && matchesToken(text, index + 1, "infinity")) {
      output += "null";
      index += 9;
      continue;
    }

    if (matchesToken(text, index, "infinity")) {
      output += "null";
      index += 8;
      continue;
    }

    output += character;
    ++index;
  }

  return output;
}

const nlohmann::json * findRawItems(const nlohmann::json & json)
{
  if (json.contains("raw_items") && json.at("raw_items").is_array()) {
    return &json.at("raw_items");
  }

  if (json.contains("mission") &&
    json.at("mission").is_object() &&
    json.at("mission").contains("raw_items") &&
    json.at("mission").at("raw_items").is_array())
  {
    return &json.at("mission").at("raw_items");
  }

  return nullptr;
}

const nlohmann::json * findNormalizedItems(const nlohmann::json & json)
{
  if (json.contains("mission") && json.at("mission").is_object()) {
    const auto & mission = json.at("mission");

    if (mission.contains("items") && mission.at("items").is_array()) {
      return &mission.at("items");
    }

    if (mission.contains("mission_items") && mission.at("mission_items").is_array()) {
      return &mission.at("mission_items");
    }

    if (mission.contains("mission") && mission.at("mission").is_object()) {
      const auto & nestedMission = mission.at("mission");

      if (nestedMission.contains("items") && nestedMission.at("items").is_array()) {
        return &nestedMission.at("items");
      }

      if (nestedMission.contains("mission_items") && nestedMission.at("mission_items").is_array()) {
        return &nestedMission.at("mission_items");
      }
    }
  }

  if (json.contains("mission_items") && json.at("mission_items").is_array()) {
    return &json.at("mission_items");
  }

  if (json.contains("items") && json.at("items").is_array()) {
    return &json.at("items");
  }

  return nullptr;
}

bool hasNativeMissionItems(const nlohmann::json & items)
{
  if (!items.is_array()) {
    return false;
  }

  for (const auto & item : items) {
    if (!hasString(item, "type")) {
      return false;
    }
  }

  return true;
}

nlohmann::json extractDefaults(const nlohmann::json & json)
{
  nlohmann::json defaults = nlohmann::json::object();

  if (json.contains("mission") && json.at("mission").is_object()) {
    const auto & mission = json.at("mission");

    if (mission.contains("defaults") && mission.at("defaults").is_object()) {
      defaults = mission.at("defaults");
    }

    if (mission.contains("mission") &&
      mission.at("mission").is_object() &&
      mission.at("mission").contains("defaults") &&
      mission.at("mission").at("defaults").is_object())
    {
      defaults = mission.at("mission").at("defaults");
    }
  }

  if (!defaults.contains("horizontalVelocity")) {
    defaults["horizontalVelocity"] = hasNumber(defaults, "speed_m_s") ?
      defaults.at("speed_m_s").get<double>() :
      5.0;
  }

  if (!defaults.contains("verticalVelocity")) {
    defaults["verticalVelocity"] = 2.0;
  }

  if (!defaults.contains("maxHeadingRate")) {
    defaults["maxHeadingRate"] = 60.0;
  }

  return defaults;
}

double altitudeReferenceMsl(const nlohmann::json & json, double currentAltitudeMsl)
{
  if (hasNumber(json, "altitude_reference_msl")) {
    return json.at("altitude_reference_msl").get<double>();
  }

  if (hasNumber(json, "home_altitude_msl")) {
    return json.at("home_altitude_msl").get<double>();
  }

  if (json.contains("home") && hasNumber(json.at("home"), "alt_msl")) {
    return json.at("home").at("alt_msl").get<double>();
  }

  if (json.contains("target") && hasNumber(json.at("target"), "home_altitude_msl")) {
    return json.at("target").at("home_altitude_msl").get<double>();
  }

  return currentAltitudeMsl;
}

int mavCommandOf(const nlohmann::json & item)
{
  if (hasNumber(item, "command")) {
    return item.at("command").get<int>();
  }

  if (!hasString(item, "command")) {
    return -1;
  }

  const auto command = toLower(item.at("command").get<std::string>());

  if (command.find("waypoint") != std::string::npos) {
    return kMavCmdNavWaypoint;
  }

  if (command.find("takeoff") != std::string::npos) {
    return kMavCmdNavTakeoff;
  }

  if (command.find("land") != std::string::npos) {
    return kMavCmdNavLand;
  }

  if (command.find("rtl") != std::string::npos || command.find("return") != std::string::npos) {
    return kMavCmdNavRtl;
  }

  if (command.find("speed") != std::string::npos) {
    return kMavCmdDoChangeSpeed;
  }

  return -1;
}

bool usesRelativeAltitudeFrame(const nlohmann::json & item)
{
  if (hasNumber(item, "frame")) {
    const int frame = item.at("frame").get<int>();
    return frame == kMavFrameGlobalRelativeAlt || frame == kMavFrameGlobalRelativeAltInt;
  }

  if (hasString(item, "frame")) {
    return toLower(item.at("frame").get<std::string>()).find("relative") != std::string::npos;
  }

  return false;
}

bool usesGlobalFrame(const nlohmann::json & item)
{
  if (hasNumber(item, "frame")) {
    const int frame = item.at("frame").get<int>();

    return frame == kMavFrameGlobal ||
      frame == kMavFrameGlobalInt ||
      frame == kMavFrameGlobalRelativeAlt ||
      frame == kMavFrameGlobalRelativeAltInt;
  }

  if (hasString(item, "frame")) {
    return toLower(item.at("frame").get<std::string>()).find("global") != std::string::npos;
  }

  return true;
}

double decodeScaledDegree(double value, bool isLatitude)
{
  if (!isFinite(value)) {
    return value;
  }

  const double limit = isLatitude ? 90.0 : 180.0;

  if (std::abs(value) > limit && std::abs(value) > 1000.0) {
    return value * 1e-7;
  }

  return value;
}

bool readGlobalPosition(const nlohmann::json & item, double & latitude, double & longitude)
{
  latitude = getNumberOrNan(item, "latitude_deg");
  longitude = getNumberOrNan(item, "longitude_deg");

  if (!isFinite(latitude)) {
    latitude = getNumberOrNan(item, "lat");
  }

  if (!isFinite(longitude)) {
    longitude = getNumberOrNan(item, "lon");
  }

  if (!isFinite(latitude)) {
    latitude = getNumberOrNan(item, "x");
  }

  if (!isFinite(longitude)) {
    longitude = getNumberOrNan(item, "y");
  }

  latitude = decodeScaledDegree(latitude, true);
  longitude = decodeScaledDegree(longitude, false);

  return isFinite(latitude) &&
    isFinite(longitude) &&
    std::abs(latitude) <= 90.0 &&
    std::abs(longitude) <= 180.0;
}

double readAltitudeMsl(const nlohmann::json & item, double referenceAltitudeMsl)
{
  if (hasNumber(item, "altitude_msl")) {
    return item.at("altitude_msl").get<double>();
  }

  if (hasNumber(item, "alt_msl")) {
    return item.at("alt_msl").get<double>();
  }

  if (hasNumber(item, "absolute_altitude_m")) {
    return item.at("absolute_altitude_m").get<double>();
  }

  if (hasNumber(item, "relative_altitude_m")) {
    if (!isFinite(referenceAltitudeMsl)) {
      throw std::runtime_error("relative altitude needs valid current/home MSL altitude");
    }

    return referenceAltitudeMsl + item.at("relative_altitude_m").get<double>();
  }

  if (hasNumber(item, "z")) {
    if (!usesRelativeAltitudeFrame(item)) {
      return item.at("z").get<double>();
    }

    if (!isFinite(referenceAltitudeMsl)) {
      throw std::runtime_error("relative MAVLink frame needs valid current/home MSL altitude");
    }

    return referenceAltitudeMsl + item.at("z").get<double>();
  }

  if (hasNumber(item, "altitude")) {
    if (usesRelativeAltitudeFrame(item) && isFinite(referenceAltitudeMsl)) {
      return referenceAltitudeMsl + item.at("altitude").get<double>();
    }

    return item.at("altitude").get<double>();
  }

  if (!isFinite(referenceAltitudeMsl)) {
    throw std::runtime_error("mission item has no altitude and no valid altitude reference");
  }

  return referenceAltitudeMsl;
}

nlohmann::json makeWaypointItem(
  const nlohmann::json & sourceItem,
  int index,
  double latitude,
  double longitude,
  double altitudeMsl)
{
  return {
    {"type", "navigation"},
    {"navigationType", "waypoint"},
    {"frame", "global"},
    {"id", buildItemId(sourceItem, "fc_wp_", index)},
    {"x", latitude},
    {"y", longitude},
    {"z", altitudeMsl}};
}

void addSkippedItem(
  nlohmann::json & skippedItems,
  const nlohmann::json & sourceItem,
  int index,
  int command,
  const std::string & reason)
{
  nlohmann::json output{
    {"index", index},
    {"id", buildItemId(sourceItem, "fc_skip_", index)},
    {"reason", reason}};

  if (command >= 0) {
    output["command"] = command;
  }

  if (hasString(sourceItem, "command_name")) {
    output["command_name"] = sourceItem.at("command_name");
  }

  skippedItems.push_back(output);
}

bool addExecutableItem(
  nlohmann::json & output,
  const nlohmann::json & sourceItem,
  int index,
  double referenceAltitudeMsl)
{
  auto & items = output["mission"]["items"];
  auto & skippedItems = output["skipped_source_items"];

  const int command = mavCommandOf(sourceItem);
  const std::string type = hasString(sourceItem, "type") ?
    toLower(sourceItem.at("type").get<std::string>()) :
    "";

  if (command == kMavCmdDoChangeSpeed) {
    addSkippedItem(
      skippedItems,
      sourceItem,
      index,
      command,
      "do_change_speed_kept_as_mavlink_metadata_not_flight_item");

    return false;
  }

  if (command == kMavCmdNavRtl || type == "rtl") {
    items.push_back({
      {"type", "rtl"},
      {"id", buildItemId(sourceItem, "fc_rtl_", index)}});

    return true;
  }

  if (command == kMavCmdNavTakeoff || type == "takeoff") {
    items.push_back({
      {"type", "takeoff"},
      {"id", buildItemId(sourceItem, "fc_takeoff_", index)},
      {"altitude", readAltitudeMsl(sourceItem, referenceAltitudeMsl)}});

    return true;
  }

  if (command == kMavCmdNavLand || type == "land") {
    double latitude{};
    double longitude{};

    if (readGlobalPosition(sourceItem, latitude, longitude) && usesGlobalFrame(sourceItem)) {
      items.push_back(makeWaypointItem(
        sourceItem,
        index,
        latitude,
        longitude,
        readAltitudeMsl(sourceItem, referenceAltitudeMsl)));
    }

    items.push_back({
      {"type", "land"},
      {"id", buildItemId(sourceItem, "fc_land_", index)}});

    return true;
  }

  if (command == kMavCmdNavWaypoint || type == "navigation" || command < 0) {
    double latitude{};
    double longitude{};

    if (readGlobalPosition(sourceItem, latitude, longitude) && usesGlobalFrame(sourceItem)) {
      items.push_back(makeWaypointItem(
        sourceItem,
        index,
        latitude,
        longitude,
        readAltitudeMsl(sourceItem, referenceAltitudeMsl)));

      return true;
    }
  }

  addSkippedItem(
    skippedItems,
    sourceItem,
    index,
    command,
    "non_navigation_mavlink_action_skipped");

  return false;
}

PlanInfo finishPlan(nlohmann::json & output, int sourceItemCount)
{
  bool hasPreTakeoff = false;
  std::optional<double> takeoffAltitudeMsl;

  auto & items = output["mission"]["items"];

  if (items.is_array() && !items.empty() && items.front().value("type", "") == "takeoff") {
    hasPreTakeoff = true;

    const auto & takeoffItem = items.front();

    if (hasNumber(takeoffItem, "altitude")) {
      takeoffAltitudeMsl = takeoffItem.at("altitude").get<double>();
    }

    items.erase(items.begin());
  }

  output["pre_takeoff"] = hasPreTakeoff;
  output["pre_takeoff_alt_msl"] = takeoffAltitudeMsl ?
    nlohmann::json(*takeoffAltitudeMsl) :
    nlohmann::json(nullptr);

  output["executable_item_count"] = items.size();
  output["skipped_item_count"] = output["skipped_source_items"].size();

  if (items.empty()) {
    throw std::runtime_error("mission has no executable waypoint/land/rtl item after pre-takeoff");
  }

  const px4_ros2::Mission mission(output);

  return {
    output,
    mission.checksum(),
    sourceItemCount,
    static_cast<int>(items.size()),
    static_cast<int>(output["skipped_source_items"].size()),
    hasPreTakeoff,
    takeoffAltitudeMsl};
}

bool isDirectNativeMission(const nlohmann::json & input)
{
  return input.contains("mission") &&
    input.at("mission").is_object() &&
    input.at("mission").contains("items") &&
    input.at("mission").at("items").is_array() &&
    hasNativeMissionItems(input.at("mission").at("items"));
}

nlohmann::json makeRawMissionOutput(
  const nlohmann::json & input,
  const nlohmann::json & rawItems,
  double referenceAltitudeMsl)
{
  nlohmann::json output;

  output["version"] = input.value("version", 1);
  output["source_format"] = "mavlink_mission_protocol_raw_items";
  output["source_item_count"] = hasNumber(input, "item_count") ?
    input.at("item_count") :
    nlohmann::json(rawItems.size());
  output["remote_opaque_id"] = input.contains("remote_opaque_id") ?
    input.at("remote_opaque_id") :
    nlohmann::json(nullptr);
  output["source_hash"] = input.contains("hash") ?
    input.at("hash") :
    nlohmann::json(nullptr);
  output["altitude_reference_msl"] = isFinite(referenceAltitudeMsl) ?
    nlohmann::json(referenceAltitudeMsl) :
    nlohmann::json(nullptr);

  if (input.contains("target")) {
    output["target_system"] = input.at("target");
  }

  output["mission"]["defaults"] = extractDefaults(input);
  output["mission"]["items"] = nlohmann::json::array();
  output["skipped_source_items"] = nlohmann::json::array();

  for (int index = 0; index < static_cast<int>(rawItems.size()); ++index) {
    addExecutableItem(output, rawItems.at(index), index, referenceAltitudeMsl);
  }

  return output;
}

nlohmann::json makeNormalizedMissionOutput(
  const nlohmann::json & input,
  const nlohmann::json & items,
  double referenceAltitudeMsl)
{
  nlohmann::json output;

  output["version"] = 1;
  output["source_format"] = "normalized_mission_items";
  output["source_item_count"] = items.size();
  output["altitude_reference_msl"] = isFinite(referenceAltitudeMsl) ?
    nlohmann::json(referenceAltitudeMsl) :
    nlohmann::json(nullptr);

  output["mission"]["defaults"] = extractDefaults(input);
  output["mission"]["items"] = nlohmann::json::array();
  output["skipped_source_items"] = nlohmann::json::array();

  for (int index = 0; index < static_cast<int>(items.size()); ++index) {
    addExecutableItem(output, items.at(index), index, referenceAltitudeMsl);
  }

  return output;
}
}  // namespace

std::string missionKey(const std::string & text)
{
  try {
    const auto json = nlohmann::json::parse(sanitizeJsonText(text));

    nlohmann::json key;

    if (json.contains("source")) {
      key["source"] = json.at("source");
    }

    if (json.contains("remote_opaque_id")) {
      key["remote_opaque_id"] = json.at("remote_opaque_id");
    }

    if (json.contains("hash")) {
      key["hash"] = json.at("hash");
    }

    if (json.contains("item_count")) {
      key["item_count"] = json.at("item_count");
    }

    if (json.contains("downloaded_items")) {
      key["downloaded_items"] = json.at("downloaded_items");
    }

    const auto * rawItems = findRawItems(json);

    if (rawItems) {
      key["raw_count"] = rawItems->size();
      key["raw_items"] = nlohmann::json::array();

      for (const auto & item : *rawItems) {
        nlohmann::json rawItemKey;

        for (const auto * name : {
            "seq",
            "frame",
            "command",
            "mission_type",
            "current",
            "autocontinue",
            "param1",
            "param2",
            "param3",
            "param4",
            "x",
            "y",
            "z"})
        {
          if (item.contains(name)) {
            rawItemKey[name] = item.at(name);
          }
        }

        key["raw_items"].push_back(rawItemKey);
      }

      return key.dump();
    }

    const auto * items = findNormalizedItems(json);

    if (items) {
      key["items"] = *items;
      return key.dump();
    }

    return json.dump();
  } catch (...) {
    return sanitizeJsonText(text);
  }
}

PlanInfo parsePlan(const std::string & text, double currentAltitudeMsl)
{
  const auto input = nlohmann::json::parse(sanitizeJsonText(text));

  if (const auto * rawItems = findRawItems(input)) {
    const double referenceAltitudeMsl = altitudeReferenceMsl(input, currentAltitudeMsl);
    auto output = makeRawMissionOutput(input, *rawItems, referenceAltitudeMsl);

    return finishPlan(output, static_cast<int>(rawItems->size()));
  }

  const auto * items = findNormalizedItems(input);

  if (!items || !items->is_array()) {
    throw std::runtime_error("mission JSON needs raw_items or mission(.mission).items");
  }

  if (isDirectNativeMission(input)) {
    auto output = input;

    if (!output.contains("skipped_source_items")) {
      output["skipped_source_items"] = nlohmann::json::array();
    }

    return finishPlan(output, static_cast<int>(output.at("mission").at("items").size()));
  }

  const double referenceAltitudeMsl = altitudeReferenceMsl(input, currentAltitudeMsl);
  auto output = makeNormalizedMissionOutput(input, *items, referenceAltitudeMsl);

  return finishPlan(output, static_cast<int>(items->size()));
}

}  // namespace adaptive_mission_mode
