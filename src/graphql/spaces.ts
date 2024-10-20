import { gql } from "@apollo/client";

export const GET_SPACES = gql`
  subscription GetSpacesStreamingSubscription {
    spaces(order_by: { created_at: desc }) {
      id
      user_id
      link
      name
      sec
      pause
      img
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
      spaces_watchers {
        user_id
        updated_at
        space_id
        reason
        id
        for_user
        data
        created_at
      }
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

export const INSERT = gql`
  mutation Add($data: [spaces_insert_input!]!) {
    insert_spaces(objects: $data) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const INSERT_WATCHER = gql`
  mutation Add($data: [spaces_watcher_insert_input!]!) {
    insert_spaces_watcher(objects: $data) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const GET_SPACE_HANDSHAKE = gql`
  subscription GetSpacesStreamingSubscription(
    $space_id: uuid
    $for_user: uuid
  ) {
    spaces_watcher(
      where: { space_id: { _eq: $space_id }, for_user: { _eq: $for_user } }
    ) {
      id
      data
      user_id
      for_user
      reason
      created_at
      updated_at
    }
  }
`;
