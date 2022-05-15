const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    teamId: {
      type: String,
    },
    personalInformation: {
      fullName: {
        type: String,
        required: true,
      },
      dob: {
        type: Date,
        // required:true
      },
      birthPlace: {
        type: String,
      },
      gender: {
        type: String,
        // required:true
      },
      nationality: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
      aboutMe: {
        type: String,
      },
    },
    employmentInformation: {
      dateOfEmployment: {
        type: Date,
      },
      currentRole: {
        type: String,
      },
      department: {
        type: String,
      },
      manager: {
        type: String,
      },
      managerName: {
        type: String,
      },
      workEx: {
        type: String,
      },
      isManager: {
        type: Number,
      },
      team: {
        type: [String],
      },
      teamTechStack: {
        type: [String],
      },
      currentProject: {
        type: String,
      },
      hardSkills: {
        type: [String],
      },
      softSkills: {
        type: [String],
      },
      personalityMindAttr: {
        type: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
