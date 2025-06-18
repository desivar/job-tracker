const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[\d\s-()]{10,}$/, "Please provide a valid phone number"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
        maxlength: [100, "Street address cannot exceed 100 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxlength: [50, "City name cannot exceed 50 characters"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        maxlength: [50, "State name cannot exceed 50 characters"],
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
        match: [/^\d{5}(-\d{4})?$/, "Please provide a valid ZIP code"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        default: "USA",
      },
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "pending"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastContact: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
customerSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
customerSchema.virtual("fullAddress").get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Virtual for associated jobs
customerSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "customer",
});

// Indexes for faster queries
customerSchema.index({ email: 1 });
customerSchema.index({ "address.zipCode": 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ createdBy: 1 });

// Update lastContact on save if not set
customerSchema.pre("save", function (next) {
  if (!this.lastContact) {
    this.lastContact = new Date();
  }
  next();
});

// Static method to build indexes
customerSchema.statics.buildIndexes = async function () {
  try {
    await this.collection.createIndex({ "address.zipCode": 1 });
    await this.collection.createIndex({ status: 1 });
    await this.collection.createIndex({ createdBy: 1 });
    console.log("Customer indexes built successfully");
  } catch (error) {
    console.error("Error building customer indexes:", error);
    throw error;
  }
};

const Customer = mongoose.model("Customer", customerSchema);

// Build indexes when the model is compiled
Customer.buildIndexes().catch(console.error);

module.exports = Customer;
