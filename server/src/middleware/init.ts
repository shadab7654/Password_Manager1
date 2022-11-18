/**
 * This will return all the essential middleware to
 * initialize the server.
 */

import express from 'express';
import cors from 'cors';

const initMiddleware = [
  cors(),
	express.json(),
	express.urlencoded({ extended: false })
];

export default initMiddleware;
