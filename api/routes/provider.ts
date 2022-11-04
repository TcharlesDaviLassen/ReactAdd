import express, { Request, Response } from 'express';
import ProvidersModel from '../models/Provider';
import providerController from '../controllers/ProviderController';

const routerProvider = express.Router();

const validateProviderId = async (req: Request, res: Response, next: any) => {
  const provider = await ProvidersModel.findByPk(req.params.providerId);

  if (!provider) {
    return res.status(404).json({ error: 'User not found' });
  }

  next();
}

routerProvider.get('/provider/pdf', providerController.pdf);
routerProvider.get('/provider/csv', providerController.csv);

routerProvider.get('/provider', providerController.index);
routerProvider.post('/provider', providerController.create);
routerProvider.get('/provider/:providerId', validateProviderId, providerController.show);
routerProvider.put('/provider/:providerId', validateProviderId, providerController.update);
routerProvider.delete('/provider/:providerId', validateProviderId, providerController.delete);

routerProvider.get('/auth', providerController.authentication);
routerProvider.get('/verify', providerController.authentication);

export default routerProvider;