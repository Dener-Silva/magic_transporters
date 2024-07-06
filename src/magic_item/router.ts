import { Router, Request, Response } from 'express';
import { add } from './controller';
import { HTTPError } from '../utils/errors';
import { MagicItemDTO } from './dto';

export const itemRouter = Router()

itemRouter.post('/api/v1/magic_item', (req: Request, res: Response) => {
    if (typeof req.body.weight !== 'number') {
        throw new HTTPError(422, 'weight must be a number', req.body);
    }
    if (req.body.weight <= 0) {
        throw new HTTPError(422, 'weight must be greater than 0', req.body);
    }
    if (typeof req.body.name !== 'string') {
        throw new HTTPError(422, 'name must be a string', req.body);
    }

    const entity = add(req.body.name, req.body.weight)
    const body = new MagicItemDTO(entity);
    res.status(201).json(body);
})