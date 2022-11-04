import { Request, Response, NextFunction } from 'express';
import StateModel from '../models/State';

class StatesController {

  index = async (req: Request, res: Response, next: NextFunction) => {
    const states = await StateModel.findAll({});
    res.json(states);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._validateData(req.body);
      const state = await StateModel.create(data);
      res.json(state);
    }
    catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    const state = await StateModel.findByPk(req.params.stateId);
    res.json(state);
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: any = req.params.stateId;
      const data = await this._validateData(req.body);
      await StateModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await StateModel.findByPk(id));
    }
    catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    await StateModel.destroy({
      where: {
        id: req.params.stateId
      }
    });
    res.json({});
  }

  _validateData = async (data: any) => {
    const attributes = ['name', 'province'];
    const state: any = {};

    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }

      state[attribute] = data[attribute];
    }

    return state;
  }

}

export default new StatesController();