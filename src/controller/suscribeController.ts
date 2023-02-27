import { Request, Response, NextFunction } from 'express';
import Suscribe from '../model/suscribeModel';
import { suscribeSchema } from '../utils/utils';

// create a new suscribe controller function
export const suscribeController = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const { error } = suscribeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }
    const duplicateEmail = await Suscribe.findOne({email})

    if(duplicateEmail){
      return res.status(401).json({message:"You have already suscribed to ISDS News Letter"})
    }
    const newSuscribe = new Suscribe({
      email,
      date: new Date().toISOString(),
    });
    newSuscribe.save((err, suscribe) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err,
        });
      }
      return res.status(201).json({
        status: 'success',
        message: 'You have successfully suscribed',
        data: suscribe,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
