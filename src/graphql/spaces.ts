import { gql } from "@apollo/client";

export const GET_SPACES = gql`
  subscription GetSpacesStreamingSubscription {
    spaces {
      id
      user_id
      link
      name
      sec
      pause
      created_at
      updated_at
    }
  }
`;

export const GET_SPACE = gql`
  subscription GetSpacesStreamingSubscription($id: uuid) {
    spaces(where: { id: { _eq: $id } }) {
      id
      user_id
      link
      name
      sec
      pause
      created_at
      updated_at
    }
  }
`;

export const UPDATE_MUTATION = gql`
  mutation MyMutation($id: uuid, $data: spaces_set_input!) {
    update_spaces(where: { id: { _eq: $id } }, _set: $data) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
