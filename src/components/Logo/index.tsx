import React from 'react';

export const Logo: React.FC<{
    color?: string
    kind?: 'no-text' | 'letterhead'
}> = (props) => {

    // TODO: don't hardcode this
    if (!props.kind) {
        props.kind = 'no-text';
    }

    const kindSeparator = !props.kind ? '' : '_';

    const logoUrl = "/blue-dwarf-space_logo" + kindSeparator + props.kind + ".png";

    return (
        <div>
            <img
                src={logoUrl}
                alt="Blue Dwarf Space logo"
                height={50}
            />
        </div>
    )
}
