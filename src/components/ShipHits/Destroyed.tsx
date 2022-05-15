import React, { useEffect, useState } from 'react';

export interface IShipDestroyed {
    count: number,
    destroyed: boolean,
}

const ShipDestroyed = ({ count, destroyed }: IShipDestroyed) => {
    const [total, setTotal] = useState<number[] | null>(null);

    useEffect(() => {
        if (!total && count) {
            setTotal(Array.from(new Array(count), (i) => i));
        }
        
    }, [destroyed]);

    return(
        <>
            {(total && total.length && destroyed) && total.map((el, i) => {
                // return <img key={i} className="hit s" src="/HitSmall.png" alt="" />;
                return <div key={i} className="hit s bg-image" />;
            })}
        </>
    );
};

export default React.memo(ShipDestroyed);