import mongoose from "mongoose";

const ApprovalRuleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  maxAmount: {
    type: Number,
    default: null,
  },
  approvers: [
    {
      userId: String,
      order: Number, // Order in sequential approval
    },
  ],
  isManagerApproverRequired: {
    type: Boolean,
    default: true, // If true, employee's manager must approve first
  },
  isSequential: {
    type: Boolean,
    default: false, // If true, approvals must be in sequence
  },
  minApprovalPercentage: {
    type: Number,
    default: 100, // Percentage of approvers needed (e.g., 50 = 50%)
  },
  specificApproverRule: {
    enabled: { type: Boolean, default: false },
    approverId: String, // If this approver approves, auto-approve expense
  },
  categories: [
    {
      type: String, // Apply rule to specific expense categories
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure indexes
ApprovalRuleSchema.index({ id: 1 }, { unique: true });
ApprovalRuleSchema.index({ companyId: 1 });
ApprovalRuleSchema.index({ isActive: 1 });

// Delete existing model to force re-compilation
if (mongoose.models.ApprovalRule) {
  delete mongoose.models.ApprovalRule;
}

const ApprovalRuleModel = mongoose.model("ApprovalRule", ApprovalRuleSchema);

export default ApprovalRuleModel;
