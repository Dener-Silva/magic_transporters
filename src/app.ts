import express from 'express';
import { moverRouter } from './magic_mover/router';
import { HTTPError } from './utils/errors';
import { itemRouter } from './magic_item/router';
import { LOGGER } from './utils/logger';

export const app = express();

app.use(express.json());
app.use(moverRouter);
app.use(itemRouter);
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof HTTPError) {
        res.status(err.status).json({ message: err.message, metadata: err.metadata });
        LOGGER.log('error', err.message, err.metadata);
    } else {
        LOGGER.log('error', err.message);
    }
    next(err)
});
