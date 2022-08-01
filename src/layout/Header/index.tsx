import { Fragment } from "react";
// import classes from './index.module.scss';
import { HeaderResponsive } from "./Desktop";
// import { MobileHeader } from "./Mobile";
// import { PayloadAdminBarProps } from 'payload-admin-bar';


const theLinks = [
    {
        "link": "/about",
        "label": "About"
    },
    {
        "link": "/mission",
        "label": "Mission"
    },
    {
        "link": "/press",
        "label": "Press"
    },
    {
        "link": "/contact",
        "label": "Contact"
    },
]


export const Header: React.FC<{
    //   adminBarProps?: PayloadAdminBarProps
}> = () => {
    //   const {
    //     adminBarProps
    //   } = props;

    return (
        <Fragment>
            <HeaderResponsive links={theLinks} />
            {/* <MobileHeader
        className={classes.mobile}
        adminBarProps={adminBarProps}
      /> */}
        </Fragment>
    )
}
