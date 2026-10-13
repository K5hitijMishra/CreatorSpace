import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['creator', 'client'], default: 'creator' },
  },
  { timestamps: true }
);

const CreatorProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    handle: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    coverUrl: { type: String },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, default: 'Global / Remote' },
    specialization: { type: String, required: true, index: true },
    skills: [{ type: String, index: true }],
    aiTools: [{ type: String, index: true }],
    socialLinks: {
      website: String,
      twitter: String,
      instagram: String,
      artstation: String,
      github: String,
    },
    rates: {
      hourly: String,
      projectStartingAt: String,
    },
    availableForWork: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    projectCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const WorkflowStepSchema = new Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  tool: { type: String, required: true },
  description: { type: String, required: true },
});

const PortfolioProjectSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: 'CreatorProfile', required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    thumbnailUrl: { type: String },
    aspectRatio: { type: String, enum: ['16:9', '4:3', '1:1', '9:16', '3:4'], default: '16:9' },
    contentType: {
      type: String,
      enum: ['Concept Art', 'Cinematic Film', 'Editorial Fashion', 'Architecture', 'Character Design', 'Motion Graphic'],
      required: true,
      index: true,
    },
    toolsUsed: [{ type: String, index: true }],
    workflowSteps: [WorkflowStepSchema],
    commercialUseDisclosure: {
      type: String,
      enum: ['Commercial Use Permitted', 'Editorial / Non-Commercial Only', 'Custom License Upon Request'],
      required: true,
    },
    promptDetails: {
      promptSnippet: String,
      negativePrompt: String,
      seed: String,
      cfgScale: Number,
      sampler: String,
    },
    tags: [{ type: String, index: true }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: mongoose.Model<any> =
  mongoose.models.User || mongoose.model('User', UserSchema);
export const CreatorProfileModel: mongoose.Model<any> =
  mongoose.models.CreatorProfile || mongoose.model('CreatorProfile', CreatorProfileSchema);
export const PortfolioProjectModel: mongoose.Model<any> =
  mongoose.models.PortfolioProject || mongoose.model('PortfolioProject', PortfolioProjectSchema);
