import User from '../models/User.js';

export const adminRegisterUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone, enrollmentId, employeeId, canRegisterStudents } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (role === 'admin' || role === 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Cannot create admin or principal accounts through this endpoint',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const userData = {
      name,
      email,
      password,
      role,
      department,
      phone,
      createdBy: req.user.id,
      isActive: true,
    };

    if (role === 'student' && enrollmentId) {
      userData.enrollmentId = enrollmentId;
    }

    if (role === 'teacher') {
      if (employeeId) userData.employeeId = employeeId;
      userData.canRegisterStudents = canRegisterStudents === true;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        enrollmentId: user.enrollmentId,
        employeeId: user.employeeId,
        canRegisterStudents: user.canRegisterStudents,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const teacherRegisterStudent = async (req, res) => {
  try {
    const { name, email, password, batch,department, phone, enrollmentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email',
      });
    }

    const student = await User.create({
      name,
      email,
      password,
      batch,
      role: 'student',
      department,
      phone,
      enrollmentId,
      createdBy: req.user.id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        department: student.department,
        phone: student.phone,
        enrollmentId: student.enrollmentId,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const toggleTeacherPermission = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'Only teachers can have student registration permissions',
      });
    }

    user.canRegisterStudents = !user.canRegisterStudents;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Student registration permission ${user.canRegisterStudents ? 'granted' : 'revoked'}`,
      canRegisterStudents: user.canRegisterStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .populate('createdBy', 'name email')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    const stats = {
      total: await User.countDocuments(),
      students: await User.countDocuments({ role: 'student' }),
      teachers: await User.countDocuments({ role: 'teacher' }),
      admins: await User.countDocuments({ role: 'admin' }),
      principals: await User.countDocuments({ role: 'principal' }),
    };

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      createdBy: req.user.id,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      students,
      total: students.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
