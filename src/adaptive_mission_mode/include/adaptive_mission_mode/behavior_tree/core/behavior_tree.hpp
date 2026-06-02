/****************************************************************************
 * Copyright (c) 2026.
 * SPDX-License-Identifier: BSD-3-Clause
 ****************************************************************************/

#pragma once

#include <functional>
#include <memory>
#include <string>
#include <utility>
#include <vector>

namespace adaptive_mission_mode::bt
{

enum class NodeStatus
{
  Failure,
  Success,
  Running,
};

class TreeNode
{
public:
  explicit TreeNode(std::string name)
  : name_(std::move(name))
  {
  }

  virtual ~TreeNode() = default;
  virtual NodeStatus tick() = 0;
  virtual void halt() {}

  const std::string & name() const {return name_;}

private:
  std::string name_;
};

class ActionNode final : public TreeNode
{
public:
  using Callback = std::function<NodeStatus()>;

  ActionNode(std::string name, Callback callback)
  : TreeNode(std::move(name)), callback_(std::move(callback))
  {
  }

  NodeStatus tick() override
  {
    return callback_();
  }

private:
  Callback callback_;
};

class ControlNode : public TreeNode
{
public:
  explicit ControlNode(std::string name)
  : TreeNode(std::move(name))
  {
  }

  void addChild(std::unique_ptr<TreeNode> child)
  {
    children_.push_back(std::move(child));
  }

  void halt() override
  {
    for (auto & child : children_) {
      child->halt();
    }
    runningChildIndex_ = 0U;
  }

protected:
  std::vector<std::unique_ptr<TreeNode>> children_;
  std::size_t runningChildIndex_{0U};
};

class ReactiveSequence final : public ControlNode
{
public:
  using ControlNode::ControlNode;

  NodeStatus tick() override
  {
    for (auto & child : children_) {
      const auto status = child->tick();
      if (status != NodeStatus::Success) {
        return status;
      }
    }

    return NodeStatus::Success;
  }
};

class AlwaysSuccess final : public TreeNode
{
public:
  explicit AlwaysSuccess(std::unique_ptr<TreeNode> child)
  : TreeNode("AlwaysSuccess"), child_(std::move(child))
  {
  }

  NodeStatus tick() override
  {
    child_->tick();
    return NodeStatus::Success;
  }

  void halt() override
  {
    child_->halt();
  }

private:
  std::unique_ptr<TreeNode> child_;
};

}  // namespace adaptive_mission_mode::bt
