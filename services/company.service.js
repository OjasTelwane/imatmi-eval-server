/*******************************************************************************************************
 * Companies Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/10/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const Company = require('../models/Company');
const ApiError = require('../middleware/api.error');
const userService = require('./user.service');

exports.create = async (companyDto, res, next, sendData = true) => {
  try {
    console.log('create=Before Create=>', companyDto);
    const newCompany = new Company(companyDto);
    const data = await newCompany.save();
    if (!data) {
      next(ApiError.badRequest('Error in Company Insert!'));
      return;
    } else {
      if (sendData) {
        res.status(201).send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.createCompanyAdmin = async (
  companyAdminDto,
  res,
  next,
  sendData = true
) => {
  try {
    const companyDto = {
      companyName: companyAdminDto.companyName,
      companyEmail: companyAdminDto.companyEmail,
      companyContactNo: companyAdminDto.companyContactNo,
      companyWebsite: companyAdminDto.companyWebsite,
      isActive: companyAdminDto.isActive,
    };
    const newCompany = new Company(companyDto);
    const companyAdmin = await newCompany.save();
    if (companyAdmin) {
      companyAdminDto.companyId = companyAdmin._id.toString();
      const userDto = {
        companyId: companyAdminDto.companyId,
        name: companyAdminDto.name,
        empId: companyAdminDto.empId,
        email: companyAdminDto.email,
        password: companyAdminDto.password,
        isAdmin: companyAdminDto.isAdmin,
        isActive: companyAdminDto.isActive,
        isFirstTime: true,
        role: companyAdminDto.role,
      };
      const data = await userService.create(userDto, res, next, false);
      // console.log('data===userService.create=>', data);
      if (!data) {
        if (sendData) {
          next(ApiError.badRequest('Error in User Creation!'));
          return;
        } else {
          return;
        }
      }
      // console.log('after userService.create=>', data);
      companyAdminDto.userId = data._id.toString();
      if (sendData) {
        // console.log('res.send=>', companyAdminDto);
        res.status(201).send({ data: companyAdminDto });
        return;
      } else {
        // console.log('just return=>', companyAdminDto);
        return companyAdminDto;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.update = async (id, companyDto, res, next, sendData = true) => {
  try {
    const data = await Company.findByIdAndUpdate(id, companyDto, {
      useFindAndModify: false,
    });

    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update Company with id==' +
            id +
            ' Maybe Company was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.status(200).send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.delete = async (id, res, next, sendData = true) => {
  try {
    const data = await Company.findByIdAndRemove(id, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot delete Company with id=' +
            id +
            ' Maybe Company was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.send({
          message: 'Company was deleted successfully!',
          company: data,
        });
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findById = async (id, res, next, sendData = true) => {
  try {
    console.log('findById==>', id);
    const data = await Company.findById(id);
    if (data === null) {
      console.log('findById==>before Error return', data);
      next(ApiError.notFound('Not found: Company with id=' + id));
      return;
    } else {
      if (sendData) {
        res.send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAll = async (condition, res, next, sendData = true) => {
  try {
    const data = await Company.find(condition);
    if (data === null) {
      console.log('findAll==>before Error return', data);
      next(ApiError.notFound('Not found: Company'));
      return;
    } else {
      if (sendData) {
        res.send(data);
        return;
      } else {
        return data;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.findAllPaginate = async (
  condition,
  limit,
  offset,
  res,
  next,
  sendData = true
) => {
  try {
    const data = await Company.paginate(condition, { offset, limit });
    if (data === null) {
      console.log('findAllPaginate==>before Error return', data);
      next(ApiError.notFound('Not found: Company'));
      return;
    } else {
      if (sendData) {
        res.send({
          totalItems: data.totalDocs,
          companies: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
        return;
      } else {
        return data.docs;
      }
    }
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};
