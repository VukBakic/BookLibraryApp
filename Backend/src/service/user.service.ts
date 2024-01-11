import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';
import User from '../model/user.model';
import config from 'config';

class UserService {
  constructor() {}

  async create(
    input: any,
    imgPath: string | null,
    user_type: string
  ): Promise<any> {
    try {
      input.type = user_type;
      input.img_path = imgPath;
      const user = await User.create(input);

      return omit(user.toJSON(), 'password');
    } catch (e: any) {
      throw e;
    }
  }

  async find(query: FilterQuery<any>) {
    return User.findOne(query).lean();
  }

  async validatePassword({
    username,
    password,
    type,
  }: {
    username: string;
    password: string;
    type: any;
  }) {
    const user = await User.findOne({ username: username, type: type });

    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) return false;

    return omit(user.toJSON(), 'password');
  }

  async getPage(filter: FilterQuery<any>, page = 1) {
    const limit = config.get('page_limit') as number;
    const skip = (page - 1) * limit;

    return User.aggregate([
      {
        $facet: {
          users: [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { password: 0 } },
          ],
          total: [{ $match: filter }, { $count: 'total' }],
        },
      },
    ])
      .addFields({
        count: {
          $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0],
        },
      })
      .project({ total: 0 });
  }

  async findById(id: any) {
    return User.findById(id, '-password');
  }

  async updateUser(id: any, data: any, img_path: any = null) {
    let user = await User.findById(id).exec();

    if (user) {
      for (const field in data) {
        if (field == 'password') {
          if (data[field] && data[field] != '') user[field] = data[field];
        } else user[field] = data[field];
      }
      if (img_path) user['img_path'] = img_path;
      user = await user.save();
      return omit(user.toJSON(), 'password');
    }
    return null;
  }

  async delete(id: any): Promise<boolean> {
    try {
      const removed = await User.findByIdAndRemove(id);
      if (removed) {
        return true;
      }
    } catch (e: any) {
      return false;
    }
    return false;
  }

  async changePassword(id: any, password: string, newPassword: string) {
    let user = await User.findOne({ _id: id });

    if (!user || !(await user.comparePassword(password))) {
      return false;
    }
    user.password = newPassword;
    await user.save();
    return true;
  }

  async getRole(id: any) {
    return User.findById(id, 'type active blocked');
  }
}

export default UserService;
