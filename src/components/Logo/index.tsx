import React from 'react';

export const Logo: React.FC<{
    color?: string
    kind?: 'notext' | 'letterhead'
}> = (props) => {

    // TODO: don't hardcode this
    if (!props.kind) {
        props.kind = 'notext';
    }

    const logoUrl = "https://bluedwarf.space/assets/blue_dwarf_space_" + props.kind + "_logo.png";

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
