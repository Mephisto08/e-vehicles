import React, { useContext, useState, ChangeEvent, useEffect } from 'react';
import { RegisterContext } from '../contexts/RegisterContext';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  MenuItem,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import { authContext } from '../contexts/AuthenticationContext';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { LoginContext } from '../contexts/LoginContext';

const PaymentMethod = [
  {
    value: 'Paypal',
    label: 'Paypal',
  },
  {
    value: 'Visa',
    label: 'Visa',
  },
  {
    value: 'Bitcoin',
    label: 'Bitcoin',
  },
  {
    value: 'Mastercard',
    label: 'Mastercard',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
}));

export default function RegisterModal() {
  const classes = useStyles();
  const auth = useContext(authContext);
  const registerContext = useContext(RegisterContext);
  const loginContext = useContext(LoginContext);
  const [selectedDate, setSelectedDate] = React.useState<Date>(null);
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordShadow: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    preferedPayment: 'Paypal',
    streetPlusNumber: '',
    city: '',
  });

  useEffect(() => {
    setValues({ ...values, email: registerContext.email });
  }, [registerContext.email]);

  const handleClose = () => {
    registerContext.toggleOpen();
  };

  const format = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (format.test(e.target.value)) {
      e.target.value = values.email;
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
      if (e.target.name === 'passwordShadow') {
        if (values.password === e.target.value) {
          e.target.setCustomValidity('');
        } else {
          e.target.setCustomValidity("Passwords don't match!");
        }
      }
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setValues({ ...values, birthDate: new Date(date).toLocaleDateString() });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { passwordShadow, ...registerValues } = values; // remove password shadow from values
    auth.actions.register(registerValues);
    handleClose();
    auth.actions.login({ email: registerValues.email, password: registerValues.password }); // auto login user
    loginContext.toggleOpen();
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return ['Account', 'Personal Details', 'Payment Settings'];
  }

  return (
    <>
      <Dialog open={registerContext.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Divider />
        <form onSubmit={activeStep === steps.length - 1 ? onSubmitForm : handleNext}>
          <DialogContent>
            <>
              {activeStep === 0 ? (
                <>
                  <TextField
                    defaultValue={values.email}
                    autoFocus
                    name="email"
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                  <TextField
                    defaultValue={values.password}
                    name="password"
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                  <TextField
                    defaultValue={values.passwordShadow}
                    onChange={fieldDidChange}
                    margin="dense"
                    name="passwordShadow"
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    required
                  />
                </>
              ) : (
                ''
              )}
              {activeStep === 1 ? (
                <>
                  <TextField
                    defaultValue={values.firstName}
                    autoFocus
                    name="firstName"
                    margin="dense"
                    id="firstName"
                    label="First name"
                    type="text"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                  <TextField
                    defaultValue={values.lastName}
                    name="lastName"
                    margin="dense"
                    id="lastName"
                    label="Last name"
                    type="text"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        id="birthDate"
                        name="birthDate"
                        margin="dense"
                        label="Birthdate"
                        format="yyyy-MM-dd"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        required
                        fullWidth
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <TextField
                    defaultValue={values.streetPlusNumber}
                    name="streetPlusNumber"
                    margin="dense"
                    id="streetPlusNumber"
                    label="Street and Number"
                    type="text"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                  <TextField
                    defaultValue={values.city}
                    name="city"
                    margin="dense"
                    id="city"
                    label="City"
                    type="text"
                    fullWidth
                    onChange={fieldDidChange}
                    required
                  />
                </>
              ) : (
                ''
              )}
              {activeStep === 2 ? (
                <TextField
                  defaultValue={values.preferedPayment}
                  autoFocus
                  name="preferedPayment"
                  margin="dense"
                  id="preferedPayment"
                  select
                  label="Preferred Payment"
                  type="text"
                  onChange={fieldDidChange}
                  helperText="Please select your favorite payment method"
                >
                  {PaymentMethod.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                ''
              )}
            </>
          </DialogContent>
          <DialogActions>
            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.backButton}>
              Back
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}