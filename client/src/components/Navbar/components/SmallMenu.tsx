import MenuIcon from "../../../assets/icons/menuIcon.svg";
import { MenuItem } from "../Navbar";
import { Link } from "react-router-dom";

type Prop = {
  menuItems: MenuItem[];
  className: string;
};

const SmallMenu = ({ menuItems, className }: Prop) => {
  return (
    <div className={className}>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost">
          <img src={MenuIcon} alt="Menu" />
        </label>
        <div
          tabIndex={0}
          className="dropdown-content menu bg-sky-50 rounded-box p-2 w-36 mt-3"
        >
          {menuItems.map((i, index) => {
            return (
              <Link
                className="btn btn-ghost normal-case text-md justify-start"
                to={i.path}
                key={index}
              >
                {i.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmallMenu;