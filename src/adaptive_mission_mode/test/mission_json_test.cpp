#include <gtest/gtest.h>

#include <cmath>
#include <string>

#include "adaptive_mission_mode/core/mission_json.hpp"

namespace
{

TEST(MissionJsonTest, AcceptsStandardPx4Ros2MissionJsonWithLeadingTakeoff)
{
  constexpr float kPi = 3.14159265358979323846F;
  const std::string missionJson = R"({
    "version": 1,
    "mission": {
      "defaults": {
        "horizontalVelocity": 5.0,
        "verticalVelocity": 2.0,
        "maxHeadingRate": 60.0
      },
      "items": [
        {
          "type": "takeoff",
          "altitude_m": 10.0
        },
        {
          "type": "navigation",
          "navigationType": "waypoint",
          "x": 47.3977419,
          "y": 8.5455939,
          "z": 500.0,
          "frame": "global"
        },
        {
          "type": "rtl"
        }
      ]
    }
  })";

  const auto normalizedMission = adaptive_mission_mode::parseStandardMissionJson(missionJson);

  EXPECT_EQ(normalizedMission.leading_takeoff_items, 1U);
  ASSERT_TRUE(normalizedMission.leading_takeoff_altitude_relative_m.has_value());
  EXPECT_FLOAT_EQ(*normalizedMission.leading_takeoff_altitude_relative_m, 10.0F);
  EXPECT_FALSE(normalizedMission.leading_takeoff_altitude_amsl.has_value());
  ASSERT_EQ(normalizedMission.mission.items().size(), 2U);

  const auto & defaults = normalizedMission.mission.defaults().trajectory_options;
  ASSERT_TRUE(defaults.horizontal_velocity.has_value());
  ASSERT_TRUE(defaults.vertical_velocity.has_value());
  ASSERT_TRUE(defaults.max_heading_rate.has_value());
  EXPECT_FLOAT_EQ(*defaults.horizontal_velocity, 5.0F);
  EXPECT_FLOAT_EQ(*defaults.vertical_velocity, 2.0F);
  EXPECT_NEAR(*defaults.max_heading_rate, kPi / 3.0F, 1.0e-5F);

  const auto * navigationItem =
    std::get_if<px4_ros2::NavigationItem>(&normalizedMission.mission.items()[0]);
  ASSERT_NE(navigationItem, nullptr);
  const auto * waypoint = std::get_if<px4_ros2::Waypoint>(&navigationItem->data);
  ASSERT_NE(waypoint, nullptr);
  EXPECT_DOUBLE_EQ(waypoint->coordinate(0), 47.3977419);
  EXPECT_DOUBLE_EQ(waypoint->coordinate(1), 8.5455939);
  EXPECT_DOUBLE_EQ(waypoint->coordinate(2), 500.0);
  EXPECT_EQ(waypoint->frame, px4_ros2::MissionFrame::Global);

  const auto * actionItem =
    std::get_if<px4_ros2::ActionItem>(&normalizedMission.mission.items()[1]);
  ASSERT_NE(actionItem, nullptr);
  EXPECT_EQ(actionItem->name, "rtl");
}

TEST(MissionJsonTest, AcceptsLeadingTakeoffAmslAltitudeAlias)
{
  const std::string missionJson = R"({
    "version": 1,
    "mission": {
      "items": [
        {
          "type": "takeoff",
          "altitudeAmsl": 510.0
        },
        {
          "type": "rtl"
        }
      ]
    }
  })";

  const auto normalizedMission = adaptive_mission_mode::parseStandardMissionJson(missionJson);

  EXPECT_EQ(normalizedMission.leading_takeoff_items, 1U);
  EXPECT_FALSE(normalizedMission.leading_takeoff_altitude_relative_m.has_value());
  ASSERT_TRUE(normalizedMission.leading_takeoff_altitude_amsl.has_value());
  EXPECT_FLOAT_EQ(*normalizedMission.leading_takeoff_altitude_amsl, 510.0F);
}

TEST(MissionJsonTest, RejectsTakeoffOutsideMissionStart)
{
  const std::string missionJson = R"({
    "version": 1,
    "mission": {
      "items": [
        {
          "type": "navigation",
          "navigationType": "waypoint",
          "x": 47.3977419,
          "y": 8.5455939,
          "z": 500.0,
          "frame": "global"
        },
        {
          "type": "takeoff"
        },
        {
          "type": "rtl"
        }
      ]
    }
  })";

  EXPECT_THROW(
    {
      const auto unused = adaptive_mission_mode::parseStandardMissionJson(missionJson);
      static_cast<void>(unused);
    },
    std::runtime_error);
}

TEST(MissionJsonTest, RejectsMissionContainingOnlyTakeoff)
{
  const std::string missionJson = R"({
    "version": 1,
    "mission": {
      "items": [
        {
          "type": "takeoff"
        }
      ]
    }
  })";

  EXPECT_THROW(
    {
      const auto unused = adaptive_mission_mode::parseStandardMissionJson(missionJson);
      static_cast<void>(unused);
    },
    std::runtime_error);
}

TEST(MissionJsonTest, RejectsTakeoffWithBothRelativeAndAmslAltitude)
{
  const std::string missionJson = R"({
    "version": 1,
    "mission": {
      "items": [
        {
          "type": "takeoff",
          "altitude_m": 10.0,
          "altitude": 510.0
        },
        {
          "type": "rtl"
        }
      ]
    }
  })";

  EXPECT_THROW(
    {
      const auto unused = adaptive_mission_mode::parseStandardMissionJson(missionJson);
      static_cast<void>(unused);
    },
    std::runtime_error);
}

}  // namespace
