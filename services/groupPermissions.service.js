/*******************************************************************************************************
 * Group Permissions Service currently Loading and Saving Data from Mongo Db file
 * @company : Imatmi.
 * @author : Ojas Telwane.
 * @Copyright : 2021 Imatmi.
 * =====================================================================================================
 * Modification History
 * Date				Modified By		Changes Description
 * 28/11/2021 Ojas Telwane	Created
 *******************************************************************************************************/

const GroupPermissions = require('../models/GroupPermissions');
const ApiError = require('../middleware/api.error');

exports.init = async (res, next) => {
  try {
    const groupPermissions = [
      // Role: Imatmi Admin Section starts here
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Company',
        action: 'Print',
        checked: true,
      },

      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'User',
        action: 'Permissions',
        checked: true,
      },

      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Group',
        action: 'Permissions',
        checked: true,
      },

      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Question',
        action: 'Print',
        checked: true,
      },

      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'TestBank',
        action: 'Assign',
        checked: true,
      },

      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'List',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'SingleReport',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'MultipleReport',
        checked: true,
      },
      {
        role: 'Imatmi Admin',
        module: 'Test',
        action: 'CompareRetestReport',
        checked: true,
      },

      // Role: Test Moderator Section starts here

      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Question',
        action: 'Print',
        checked: true,
      },

      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'TestBank',
        action: 'Assign',
        checked: true,
      },

      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'SingleReport',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'MultipleReport',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'Test',
        action: 'CompareRetestReport',
        checked: true,
      },

      {
        role: 'Test Moderator',
        module: 'User',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'User',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'User',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Moderator',
        module: 'User',
        action: 'Print',
        checked: true,
      },

      // Role: Test Setter Section starts here

      {
        role: 'Test Setter',
        module: 'Question',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Question',
        action: 'Print',
        checked: true,
      },

      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'TestBank',
        action: 'Assign',
        checked: true,
      },

      {
        role: 'Test Setter',
        module: 'Test',
        action: 'List',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'SingleReport',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'MultipleReport',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'Test',
        action: 'CompareRetestReport',
        checked: true,
      },

      {
        role: 'Test Setter',
        module: 'User',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'User',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'User',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Test Setter',
        module: 'User',
        action: 'Print',
        checked: true,
      },

      // Role: Admin Section starts here

      {
        role: 'Admin',
        module: 'Company',
        action: 'List',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Company',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Company',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'List',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'User',
        action: 'Permissions',
        checked: true,
      },

      {
        role: 'Admin',
        module: 'TestBank',
        action: 'List',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Create',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'TestBank',
        action: 'Assign',
        checked: true,
      },

      {
        role: 'Admin',
        module: 'Test',
        action: 'List',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'Read',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'Update',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'Delete',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'Export',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'Print',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'SingleReport',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'MultipleReport',
        checked: true,
      },
      {
        role: 'Admin',
        module: 'Test',
        action: 'CompareRetestReport',
        checked: true,
      },

      // Role: User Section starts here
      {
        role: 'User',
        module: 'Test',
        action: 'List',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'Read',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'Export',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'Print',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'SingleReport',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'MultipleReport',
        checked: true,
      },
      {
        role: 'User',
        module: 'Test',
        action: 'CompareRetestReport',
        checked: true,
      },

      {
        role: 'User',
        module: 'User',
        action: 'Read',
        checked: true,
      },
      {
        role: 'User',
        module: 'User',
        action: 'Update',
        checked: true,
      },
      {
        role: 'User',
        module: 'User',
        action: 'Export',
        checked: true,
      },
      {
        role: 'User',
        module: 'User',
        action: 'Print',
        checked: true,
      },
    ];
    for (let index = 0; index < groupPermissions.length; index++) {
      const groupPermissionsDto = groupPermissions[index];
      const newGroupPermissions = new GroupPermissions(groupPermissionsDto);
      const data = await newGroupPermissions.save();
    }
    res.status(201).send('Init Success');
  } catch (err) {
    next(ApiError.internalError(err));
    return;
  }
};

exports.create = async (groupPermissionsDto, res, next, sendData = true) => {
  try {
    console.log('create=Before Create=>', groupPermissionsDto);
    const newGroupPermissions = new GroupPermissions(groupPermissionsDto);
    const data = await newGroupPermissions.save();
    if (!data) {
      next(ApiError.badRequest('Error in Group Permissions Insert!'));
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

exports.update = async (
  id,
  groupPermissionsDto,
  res,
  next,
  sendData = true
) => {
  try {
    const data = await GroupPermissions.findByIdAndUpdate(
      id,
      groupPermissionsDto,
      {
        useFindAndModify: false,
      }
    );

    if (!data) {
      next(
        ApiError.notFound(
          'Cannot update Group Permissions with id==' +
            id +
            ' Maybe Group Permissions was not found!'
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
    const data = await GroupPermissions.findByIdAndRemove(id, {
      useFindAndModify: false,
    });
    if (!data) {
      next(
        ApiError.notFound(
          'Cannot delete Group Permissions with id=' +
            id +
            ' Maybe Group Permissions was not found!'
        )
      );
      return;
    } else {
      if (sendData) {
        res.send({
          message: 'Group Permissions was deleted successfully!',
          groupPermissions: data,
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
    const data = await GroupPermissions.findById(id);
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
    const data = await GroupPermissions.find(condition);
    console.log('data==>', data);
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
    console.log('findAllPaginate==condition==>', condition);
    console.log('findAllPaginate==offset==limit==>', offset, limit);
    const data = await GroupPermissions.paginate(condition, { offset, limit });
    if (data === null) {
      console.log('findAllPaginate==>before Error return', data);
      next(ApiError.notFound('Not found: Group Permissions'));
      return;
    } else {
      if (sendData) {
        res.send({
          totalItems: data.totalDocs,
          groupPermissions: data.docs,
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
