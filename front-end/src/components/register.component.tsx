import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

type Props = {};

type State = {
  firstname: string,
  lastname: string,
  phone: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  acceptTerms: boolean,
  successful: boolean,
  message: string
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      acceptTerms: false,
      successful: false,
      message: ""
    };
  }

  validationSchema() {
    return Yup.object().shape({
      firstname: Yup.string()
          .required('First Name is required'),
      lastname: Yup.string()
          .required('Last Name is required'),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .required("This field is required!")
        .min(8, "Must be 8 characters or more")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/[@$!%*#?&]+/, "One special character")
        .matches(/\d+/, "One number"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      acceptTerms: Yup.bool().oneOf([true], 'Accept Conditions is required')
    });
  }

  handleRegister(formValue: { firstname: string; lastname: string; email: string; password: string }) {
    const { firstname, lastname, email, password } = formValue;

    this.setState({
      message: "",
      successful: false
    });

    AuthService.register(
      firstname,
      lastname,
      email,
      password
    ).then(
      response => {
        this.setState({
          message: response.data.message,
          successful: true
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          successful: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    const { successful, message } = this.state;

    const initialValues = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      acceptTerms: false,
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="firstname"> First Name </label>
                    <Field name="firstname" type="text" className="form-control" />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname"> Last Name </label>
                    <Field name="lastname" type="text" className="form-control" />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"> Email </label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password"> Password </label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passwordConfirmation"> Confirm Password </label>
                    <Field
                      name="passwordConfirmation"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="passwordConfirmation"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group form-check">
                      <Field type="checkbox" name="acceptTerms" className="form-control" />
                      <label htmlFor="acceptTerms" className="form-check-label">Accept Conditions</label>
                      <ErrorMessage name="acceptTerms" component="div" className="invalid-feedback" />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}
