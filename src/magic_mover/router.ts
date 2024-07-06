import { Router, Request, Response } from 'express';
import { add, endMission, listMoversWhoCompletedMostMissions, loadItems, startMission } from './controller';
import { HTTPError } from '../utils/errors';
import { MagicMoverDTO, MagicMoverListDTO } from './dto';

export const moverRouter = Router()

moverRouter.post('/api/v1/magic_mover', (req: Request, res: Response) => {
    if (typeof req.body.weightLimit !== 'number') {
        throw new HTTPError(422, 'weightLimit must be a number', req.body);
    }
    if (req.body.weightLimit <= 0) {
        throw new HTTPError(422, 'weightLimit must be greater than 0', req.body);
    }
    if (typeof req.body.energy !== 'number') {
        throw new HTTPError(422, 'energy must be a number', req.body);
    }
    if (req.body.energy <= 0) {
        throw new HTTPError(422, 'energy must be greater than 0', req.body);
    }

    const entity = add(req.body.weightLimit, req.body.energy);
    const body = new MagicMoverDTO(entity);
    res.status(201).json(body);
})

moverRouter.post('/api/v1/magic_mover/:id/load', (req: Request, res: Response) => {
    if (!/^\d+$/.test(req.params.id)) {
        throw new HTTPError(422, 'id must be a number', req.params);
    }
    if (!Array.isArray(req.body.items)) {
        throw new HTTPError(422, 'items must be an array of numbers representing the IDs of the Magic Items to be loaded', req.body);
    }

    const entity = loadItems(Number(req.params.id), req.body.items);
    const body = new MagicMoverDTO(entity);
    res.status(200).json(body);
})

moverRouter.post('/api/v1/magic_mover/:id/start_mission', (req: Request, res: Response) => {
    if (!/^\d+$/.test(req.params.id)) {
        throw new HTTPError(422, 'id must be a number', req.params);
    }

    const entity = startMission(Number(req.params.id));
    const body = new MagicMoverDTO(entity);
    res.status(200).json(body);
})

moverRouter.post('/api/v1/magic_mover/:id/end_mission', (req: Request, res: Response) => {
    if (!/^\d+$/.test(req.params.id)) {
        throw new HTTPError(422, 'id must be a number', req.params);
    }

    const entity = endMission(Number(req.params.id));
    const body = new MagicMoverDTO(entity);
    res.status(200).json(body);
})

moverRouter.get('/api/v1/magic_mover/most_missions', (_: Request, res: Response) => {
    const entities = listMoversWhoCompletedMostMissions();
    const body = entities.map(entity => new MagicMoverListDTO(entity));
    res.status(200).json(body);
})