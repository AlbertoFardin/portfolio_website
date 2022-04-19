import * as React from "react";
import { IProduct } from "../../../../interfaces";
import HeaderSingle from "./HeaderSingle";
import HeaderBulk from "./HeaderBulk";

interface IHeader {
  assetDatas: IProduct[];
}

const Header = ({ assetDatas }: IHeader) =>
  assetDatas.length > 1 ? (
    <HeaderBulk assetDatas={assetDatas} />
  ) : (
    <HeaderSingle assetDatas={assetDatas} />
  );

export default Header;
