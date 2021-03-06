import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'; // Higher order component HOA
import { Form, Segment, Button, Container } from 'semantic-ui-react';
import { email, length, required } from 'redux-form-validators'; //validators  

import axios from 'axios';

import { AUTH_USER, AUTH_USER_ERROR } from '../../actions/types';
// import { STATES } from 'mongoose';


class SignUp extends Component { //Must define statelss funciton outside of the render()

  skills = [
    { text: 'HTML-GIT-CSS', value: 'HTML-GIT-CSS' },
    { text: 'CSS-Bootstrap', value: 'CSS-Bootstrap' },
    { text: 'JavaScript', value: 'JavaScript' },
    { text: 'Web-APIs', value: 'Web-APIs' },
    { text: 'Third-Party-APIs', value: 'Third-Party-APIs' },
    { text: 'Server-Side-APIs', value: 'Server-Side-APIs' },
    { text: 'NodeJS', value: 'NodeJS' },
    { text: 'Object-Oriented-Programming', value: 'Object-Oriented-Programming' },
    { text: 'Express', value: 'Express' },
    { text: 'MySQL', value: 'MySQL' },
    { text: 'MVC', value: 'MVC' },
    { text: 'React', value: 'React' },
    { text: 'State', value: 'State' },
  ];

  onSubmit = async (formValues, dispatch) => {
    try {
      //formvalues looks like this { email: 'someEmail@.com, password: '123456' }
      const { data } = await axios.post('/api/auth/signup', formValues);
      localStorage.setItem('token', data.token);
      dispatch({ type: AUTH_USER, payload: data });
      this.props.history.push('/profile');
    } catch (e) {
      dispatch({ type: AUTH_USER_ERROR, payload: e });
    }
  }

  renderEmail = ({ input, meta }) => {
    return (
      <Form.Input
        {...input}
        label='Email Adress'
        error={meta.touched && meta.error}
        fluid
        icon='user'
        iconPosition='left'
        autoComplete='off'
        placeholder='Email Address'
      />
    );
  }
  renderPassword = ({ input, meta }) => {
    return (
      <Form.Input
        {...input}
        label='Password'
        error={meta.touched && meta.error}
        fluid
        type='password'
        icon='lock'
        placeholder='password'
        autoComplete='off'
        iconPosition='left'
      />
    )
  }
  renderInput = ({ input, meta, label, icon, iconPosition }) => {
    return (
      <Form.Input
        {...input}
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        error={meta.touched && meta.error}
        type='name'
        placeholder={label}
        autoComplete='off'
      />
    )
  }
  renderSkills = (field) => {
    return (
      <Form.Select
        {...field.input}
        value={field.input.value}
        //redux form with semantic drop down select
        onChange={(param, data) => field.input.onChange(data.value)}
        label={field.label}
        type='option'
        placeholder={field.label}
        autoComplete='off'
        options={this.skills}
      />
    )
  }

  //build the form
  render() {
    console.log('inside of signup render', this.props);
    const { handleSubmit, invalid, submitting, submitFailed } = this.props;
    return (
      <Container textAlign='justified'>
        <Form size='large' onSubmit={handleSubmit(this.onSubmit)} >
          <Segment stacked>
            <Field
              name='firstName'
              label='First Name'
              component={this.renderInput}
            />
            <Field
              name='lastName'
              label='Last Name'
              component={this.renderInput}
            />
            <Field
              name='strength'
              label='Strength'
              component={this.renderSkills}
              validate={
                [
                  required({ msg: 'You must select a Strength' }),
                ]
              }
            />
            <Field
              name='weakness'
              label='Weakness'
              component={this.renderSkills}
              validate={
                [
                  required({ msg: 'You must select a Weakness' }),
                ]
              }
            />
            <Field
              name='email'
              component={this.renderEmail}
              validate={
                [
                  required({ msg: 'Email is required' }), //add settings ie. msg
                  email({ msg: 'You must provide a valid email address' })  //is this email?
                ]
              }
            />
            {/* new field */}
            <Field
              name='password'
              component={this.renderPassword}
              validate={
                [
                  required({ msg: 'You must provide a password' }),
                  //make password be minimum length of 6 using validator
                  length({ min: 6, msg: 'Your password must be at least 6 characters long' })
                ]
              }
            />
            <Field
              name='github'
              label='GitHub'
              icon='github'
              iconPosition='left'
              component={this.renderInput}
              validate={
                [
                  required({ msg: 'You must provide a github username' }),
                ]
              }
            />
            <Field
              name='bio'
              label='Bio'
              component={this.renderInput}
            />
            <Button
              content='Sign up'
              color='teal'
              fluid
              size='large'
              type='submit'
              disabled={invalid || submitting || submitFailed}
            />
          </Segment>
        </Form>
      </Container>
    );
  }
}

const asyncValidate = async ({ email }) => {
  // add asyncValidation for github username

  try {
    const { data } = await axios.get(`/api/users/emails?email=${email}`);
    if (data) {
      throw new Error('Email already exists, please sign up with a different email');
    }
  } catch (e) {
    throw e;
  }
}

export default reduxForm({
  form: 'signup',
  asyncValidate,
  asyncChangeFields: ['email'],
})(SignUp);
