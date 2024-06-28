/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';

import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import RouteError from '@src/common/RouteError';
import { NodeEnvs } from '@src/common/misc';
import dbConnector from './dbConnector';

// **** Variables **** //

const app = express();


// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// **** Front-End Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

//Nav to users pg by default

/*app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
}); */ 

//Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
}); 

app.get('/CreateTourney', (_: Request, res: Response) => {
  return res.sendFile('CreateTourney.html',{root:viewsDir});
}); 

app.get('/smash.png', (_:Request,res:Response)=>{
  return res.sendFile('smash.png',{root:viewsDir});
});

app.get('/', (_:Request,res:Response)=>{
  return res.sendFile('/HomePage.html', {root:viewsDir});
});

app.get('/JoinTourney', (_:Request,res:Response)=>{
  return res.sendFile('/JoinTourney.html', {root:viewsDir});
});

app.get('/signup', (_:Request,res:Response)=>{
  return res.sendFile('/signup.html', {root:viewsDir});
});

app.get('/TourneyMenu', (_:Request,res:Response)=>{
  return res.sendFile('/TourneyMenu.html', {root:viewsDir});
});

app.get ('/dbTest', async (req: Request, res: Response) => {
  try{
    const tourneydb:dbConnector = 
      new dbConnector('postgres','superuser','localhost',5432,'tourneydb');
    const result = await tourneydb.query('Select * from fighters','');
    res.json(result.rows);
  } catch (err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  
}); 


const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());

app.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));


// **** Export default **** //

export default app;
