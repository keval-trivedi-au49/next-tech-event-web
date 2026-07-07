import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
  },
  { timestamps: true }
);

export type Booking = InferSchemaType<typeof bookingSchema>;

const Booking: Model<Booking> =
  (models.Booking as Model<Booking>) ||
  model<Booking>("Booking", bookingSchema);

export default Booking;
