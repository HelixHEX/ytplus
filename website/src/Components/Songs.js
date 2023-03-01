import React from "react";

import Song from "./Song";

import { Flex } from "@chakra-ui/react";
const Songs = ({ mt, add, remove, songs }) => {
  return (
    <>
      <Flex mt={mt} flexDir="column">
        {songs ? (
          <>
            {songs.map((data, index) => (
              <div key={index}>
                <Song
                  index={index}
                  key={index}
                  add={add}
                  remove={remove}
                  mb={"1%"}
                  data={data}
                />
              </div>
            ))}
          </>
        ) : null}
      </Flex>
    </>
  );
};

export default Songs;
