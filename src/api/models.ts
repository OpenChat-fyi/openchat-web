import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';
mongoose.pluralize(null);

const messageSchema = new Schema({
  id: { type: String },
  sender: { type: String }, // sender address
  chain: {
    id: { type: Number },
    name: { type: String },
  },
  time_data: {
    iat: { type: Number }
  },
  message: { type: String }
})

export type IMessage = InferSchemaType<typeof messageSchema>;

// MODELS
export const Message: Model<IMessage> = mongoose.model('messages', messageSchema)