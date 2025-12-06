import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepOne from './AdmissonSections/StepOne';
import StepTwo from './AdmissonSections/StepTwo';
import StepThree from './AdmissonSections/StepThree';
import StepFour from './AdmissonSections/StepFour';
import StepFive from './AdmissonSections/StepFive';
import StepSix from './AdmissonSections/StepSix';
import StepSeven from './AdmissonSections/StepSeven';
import StepEight from './AdmissonSections/StepEight';
import StepNine from './AdmissonSections/StepNine';
import { submitApplication } from '../services/admissonService';

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentDetails: {},
    addressDetails: {},
    contactDetails: {},
    otherDetails: {},
    uploadedFiles: {},
    studyDetails: [],
    preferences: {},
    signatureUpload: {},
  });

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (finalData) => {
    try {
      const response = await submitApplication(finalData);

      const data = response;
      console.log(data);
      if (data.success) {
        navigate(`/summary/${data.applicationId}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            data={formData.studentDetails}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <StepTwo
            data={formData.addressDetails}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 3:
        return (
          <StepThree
            data={formData.contactDetails}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 4:
        return (
          <StepFour
            data={formData.otherDetails}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 5:
        return (
          <StepFive
            data={formData.uploadedFiles}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 6:
        return (
          <StepSix
            data={formData.studyDetails}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 7:
        return (
          <StepSeven
            data={formData.preferences}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 8:
        return (
          <StepEight
            data={formData.signatureUpload}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 9:
        return (
          <StepNine
            formData={formData}
            onPrevious={handlePreviousStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Online Admission Application Form</h1>
        <p style={styles.stepIndicator}>Step {currentStep} of 9</p>
      </div>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progress, width: `${(currentStep / 9) * 100}%` }}></div>
      </div>
      <div style={styles.formContainer}>
        {renderStep()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  stepIndicator: {
    color: '#666',
    marginTop: '10px',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    marginBottom: '30px',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export default MultiStepForm;