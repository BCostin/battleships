import React from 'react';

interface Props {
    count: number;
}

const ShipHits = ({ count }: Props) => {
    return(
        <>
            <img className="hit s" src="/HitSmall.png" alt="" />
            <img className="hit s" src="/HitSmall.png" alt="" />
            <img className="hit s" src="/HitSmall.png" alt="" />
            <img className="hit s" src="/HitSmall.png" alt="" />
            <img className="hit s" src="/HitSmall.png" alt="" />
        </>
    );
};

export default ShipHits;