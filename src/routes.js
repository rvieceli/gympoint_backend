import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PasswordController from './app/controllers/PasswordController';

import ForgotPasswordController from './app/controllers/ForgotPasswordController';

import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckInController from './app/controllers/CheckInController';
import StatisticController from './app/controllers/StatisticController';

import StudentCheckInController from './app/controllers/StudentCheckInController';
import StudentLoginController from './app/controllers/StudentLoginController';
import StudentHelpController from './app/controllers/StudentHelpController';
import GymHelpController from './app/controllers/GymHelpController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/forgot-password', ForgotPasswordController.store);
routes.put('/forgot-password/:token', ForgotPasswordController.update);

routes.get('/students/:id/login/:token?', StudentLoginController.show);
routes.post('/students/:id/login', StudentLoginController.store);

routes.post('/students/:id/checkins', StudentCheckInController.store);
routes.get('/students/:id/checkins', StudentCheckInController.index);

routes.post('/students/:id/help-orders', StudentHelpController.store);
routes.get('/students/:id/help-orders', StudentHelpController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/password', PasswordController.update);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.get('/students/:id', StudentController.show);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.get('/plans/:id', PlanController.show);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations/:id', RegistrationController.show);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/help-orders', GymHelpController.index);
routes.post('/help-orders/:id/answer', GymHelpController.store);

routes.get('/checkins', CheckInController.index);
routes.get('/statistics', StatisticController.index);

export default routes;
