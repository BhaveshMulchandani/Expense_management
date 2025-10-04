import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  currencySymbol: {
    type: String,
    default: "₹",
  },
  adminId: {
    type: String,
    required: true,
  },
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
CompanySchema.index({ id: 1 }, { unique: true });
CompanySchema.index({ adminId: 1 });

// Delete existing model to force re-compilation
if (mongoose.models.Company) {
  delete mongoose.models.Company;
}

const CompanyModel = mongoose.model("Company", CompanySchema);

export default CompanyModel;
