import Application from '../models/Application.js';

const generateApplicationId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `OAMDC2025-${random}${timestamp}`;
};

export const createApplication = async (req, res) => {
  try {
    const {
      studentDetails,
      addressDetails,
      contactDetails,
      otherDetails,
      uploadedFiles,
      studyDetails,
      preferences,
      signatureUpload,
    } = req.body;

    const applicationId = generateApplicationId();

    const application = new Application({
      applicationId,
      studentDetails,
      addressDetails,
      contactDetails,
      otherDetails,
      uploadedFiles,
      studyDetails,
      preferences,
      signatureUpload,
      status: 'submitted',
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId,
      data: application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications.map((app) => ({
        applicationId: app.applicationId,
        studentName: app.studentDetails.studentName,
        mobileNo: app.contactDetails.mobileNo,
        gender: app.studentDetails.gender,
        status: app.status,
        createdAt: app.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.find({applicationId: id});

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message,
    });
  }
};

export const updateOfficeUseOnly = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const officeUseData = req.body;

    const application = await Application.findOneAndUpdate(
      { applicationId },
      { officeUseOnly: officeUseData },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Office use data updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error updating office use data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating office use data',
      error: error.message,
    });
  }
};

export const getApplicationBySummary = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        studentName: application.studentDetails.studentName,
        mobileNo: application.contactDetails.mobileNo,
        gender: application.studentDetails.gender,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Error fetching application summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application summary',
      error: error.message,
    });
  }
};
