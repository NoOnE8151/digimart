import mongoose from "mongoose";

const SubMerchantSchema = new mongoose.Schema({
  accountId: {              
    type: String,
    required: true,
    unique: true
  },
  type: {                   
    type: String,
    required: true
  },
  status: {                 
    type: String,
    required: true
  },
  email: {                  
    type: String,
    required: true
  },
  phone: {                  
    type: String,
    default: ""
  },
  businessType: {           
    type: String,
    default: ""
  },
  legalBusinessName: {      
    type: String,
    default: ""
  },
  customerFacingBusinessName: { 
    type: String,
    default: ""
  },
  profile: {
    category: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    businessModel: { type: String, default: "" },
    addresses: {
      registered: {
        street1: { type: String, default: "" },
        street2: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: Number, default: 0 },
        country: { type: String, default: "IN" }
      },
      operation: {
        street1: { type: String, default: "" },
        street2: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: Number, default: 0 },
        country: { type: String, default: "IN" }
      }
    }
  },
  legalInfo: {
    pan: { type: String, default: "" },
    gst: { type: String, default: "" }
  },
  apps: {
    websites: { type: [String], default: [] },
    android: {
      type: [
        {
          name: { type: String, default: "" },
          url: { type: String, default: "" }
        }
      ],
      default: []
    },
    ios: {
      type: [
        {
          name: { type: String, default: "" },
          url: { type: String, default: "" }
        }
      ],
      default: []
    }
  },
  brand: {
    color: { type: String, default: "" }
  },
  contactInfo: {
    chargeback: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      policyUrl: { type: String, default: "" }
    },
    refund: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      policyUrl: { type: String, default: "" }
    },
    support: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      policyUrl: { type: String, default: "" }
    }
  },
  notes: {
    internalRefId: { type: String, default: "" }
  },
  createdAt: { type: Date, default: Date.now },

  // --- Added fields for payouts and balance ---
  kycStatus: {               
    type: String,
    default: "pending"
  },
  balance: {                 
    type: Number,
    default: 0
  },
  currency: {                
    type: String,
    default: "INR"
  },
  totalPayouts: {            
    type: Number,
    default: 0
  },
  lastPayoutAt: {            
    type: Date,
    default: null
  },
  payoutHistory: {           
    type: [
      {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        status: { type: String, default: "" },
        requestedAt: { type: Date, default: Date.now },
        processedAt: { type: Date, default: null }
      }
    ],
    default: []
  }
});

export default mongoose.models.SubMerchant || mongoose.model("SubMerchant", SubMerchantSchema);
