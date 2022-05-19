import React from 'react';

interface IAppEmoji {
    code: string,
}
//smile: &#128516
const AppEmoji = ({ code }: IAppEmoji) => {
    return(
        <div className="emoji" dangerouslySetInnerHTML={{__html: `&#${code}`}} />
    );
};

export default AppEmoji;