import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { shipTypes } from '../../screens/Boards';
import ShipDestroyed from './Destroyed';

interface IShipHits {
    player: IPlayer,
}

const ShipHits = ({ player }: IShipHits) => {
    const [shipHit, setShipHit] = useState<any>({});
    const me = useSelector((state: RootState) => state.player);
    const { guesses } = useSelector((state: RootState) => state.game);

    useEffect(() => {
        getHitBoats(player.uuid);
        
    }, [guesses]);

    const getHitBoats = (playerUUID: IPlayer["uuid"]) => {
        const allMyHits = guesses.filter(el => el.uuid == playerUUID && el.hit);

        let boatsDestroyed: any = {};
        allMyHits.forEach(el => {
            if (el.shipType && el.uuid == playerUUID) {
                if (boatsDestroyed[el.shipType] == undefined) {
                    boatsDestroyed[el.shipType] = 0;
                }

                boatsDestroyed[el.shipType] = boatsDestroyed[el.shipType] + 1;
            }
        });

        let newState: any = {};
            newState[playerUUID] = boatsDestroyed;

        setShipHit(boatsDestroyed);
    };

    return(
        <div className="ship-statuses">
            {Object.keys(shipTypes).map((el, i) => {
                return(
                    <div key={i} className="row">
                        <img className={`ship-image ${el}`} src={shipTypes[el].image} alt="" />
                        
                        <div className="hits">
                            <ShipDestroyed
                                count={shipHit[el]} 
                                destroyed={shipHit[el] !== undefined && shipHit[el] == shipTypes[el].size} 
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShipHits;