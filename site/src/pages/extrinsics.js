import { ReactComponent as CheckIcon } from "../components/icons/check.svg";
import { ReactComponent as CrossIcon } from "../components/icons/cross.svg";
import { addressEllipsis, hashEllipsis } from "../utils/viewFuncs/text";
import { Panel } from "../components/styled/panel";
import BreadCrumb from "../components/breadCrumb";
import React, { useEffect, useState } from "react";
import { extrinsicsHead } from "../utils/constants";
import Link from "../components/styled/link";
import Layout from "../components/layout";
import Table from "../components/table";
import styled from "styled-components";
import Api from "../services/api";
import { SF_Mono_14_500 } from "../styles/text";
import { no_scroll_bar } from "../styles";
import Pagination from "../components/pagination";
import * as queryString from "query-string";
import { useLocation } from "react-router-dom";

const StyledPanel = styled(Panel)`
  overflow-x: scroll;
  ${no_scroll_bar};
`;

const ColoredLink = styled(Link)`
  color: ${({ theme }) => theme.theme500};
`;

const ColoredMonoLink = styled(Link)`
  color: ${({ theme }) => theme.theme500};
  ${SF_Mono_14_500};
`;

function Extrinsics() {
  const location = useLocation();
  const [extrinsics, setExtrinsics] = useState(null);
  const [total, setTotal] = useState(0);
  const page = queryString.parse(location.search)?.page ?? 1;

  useEffect(() => {
    setExtrinsics(null);
    Api.fetch(`/extrinsics`, {
      page: queryString.parse(location.search)?.page ?? 1,
    }).then(({ result }) => {
      setExtrinsics(result?.items ?? []);
      setTotal(result?.total ?? 0);
    });
  }, [location.search]);

  const data =
    extrinsics?.map((extrinsic, index) => {
      return [
        <ColoredLink
          key={`${index}-1`}
          to={`/extrinsic/${extrinsic?.indexer?.blockHeight}-${extrinsic?.indexer?.extrinsicIndex}`}
        >
          {extrinsic?.indexer?.blockHeight.toLocaleString()}-
          {extrinsic?.indexer?.extrinsicIndex}
        </ColoredLink>,
        <ColoredLink
          key={`${index}-2`}
          to={`/block/${extrinsic?.indexer?.blockHeight}`}
        >
          {extrinsic?.indexer?.blockHeight.toLocaleString()}
        </ColoredLink>,
        extrinsic?.indexer?.blockTime,
        <ColoredMonoLink to={""}>
          {hashEllipsis(extrinsic.hash)}
        </ColoredMonoLink>,
        extrinsic?.isSuccess ? <CheckIcon /> : <CrossIcon />,
        `${extrinsic?.call?.section}(${extrinsic?.call?.method})`,
        extrinsic?.call,
      ];
    }) ?? null;

  return (
    <Layout>
      <BreadCrumb data={[{ name: "Extrinsics" }]} />
      <StyledPanel>
        <Table heads={extrinsicsHead} data={data} />
        <Pagination page={parseInt(page)} pageSize={10} total={total} />
      </StyledPanel>
    </Layout>
  );
}

export default Extrinsics;