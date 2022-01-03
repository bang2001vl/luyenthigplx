export class SocketEvent{
  static request_get_unsync = "get_unsync_data";
  static response_get_unsync = "response_unsync_data";

  static request_insert_data = "notify_change_data";
  static response_notify_changed = "responsed_notify_data_changed";

  static update_userInfo = "update_userInfo";
  static request_get_userInfo = "get_userInfo";
  static response_get_userInfo = "response_userInfo";

  static request_deleted_data = "delete_data";

  static event_data_changed = "data_changed";
  static event_userinfo_changed = "userInfo_changed";
  static event_deleted_data = "deleted_sync_data";

  static event_authorize = "authorize";
  static event_authorized = "authorized";
  static event_failed_authorized = "authorize_failed";
}