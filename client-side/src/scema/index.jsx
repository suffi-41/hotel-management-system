import * as Yup from "yup";

export const RegisterScema = Yup.object().shape({
  firstname: Yup.string()
    .required("Required")
    .min(2, "Must be at least 3 characters")
    .max(20, "Must be at most 20 characters"),
  lastname: Yup.string()
    .required("Required")
    .min(3, "Must be at least 3 characters")
    .max(20, "Must be at most 20 characters"),
  phone: Yup.string()
    .min(10, "Must be at least 10 characters")
    .max(25, "Must be at most 10 characters")
    .required("Required"),

  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Required"),
});

export const verifyScema = Yup.object().shape({
  code: Yup.string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
});

export const loginScema = Yup.object().shape({
  phone: Yup.string()
    .required("Required")
    .min(10, "Must be at least 10 digits")
    .max(25, "Must be at most 25 digits"),
});

export const loginCradentiacl = Yup.object().shape({
  cradentical: Yup.string()
    .required("Required")
    .min(10, "Must be at least 10 digits")
    .max(100, "Must be at most 25 digits"),
});

export const mailValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
});

export const passwordScema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

export const resertPasswordCreationScema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Required"),
});
// add room validation schema
export const addRoomvalidationSchema = Yup.object({
  roomNumber: Yup.string().required("Room number is required"),
  type: Yup.string().required("Room type is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  status: Yup.string().required("Status is required"),
});

//add staff validation schema
