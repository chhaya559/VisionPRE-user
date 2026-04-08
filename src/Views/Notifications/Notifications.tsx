import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiClock,
  FiEye,
  FiFileText,
  FiInbox,
  FiRefreshCw,
  FiSettings,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import {
  useDeleteNotificationMutation,
  useGetAnnouncementsQuery,
  useGetNotificationByIdQuery,
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useReadNotificationByIdMutation,
} from '../../Services/Api/module/NotificationApi';
import './Notifications.scss';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  isRead: boolean;
  category: string;
  raw: any;
};

const getCollection = (payload: any): any[] => {
  const collections = [
    payload?.data?.items,
    payload?.data?.notifications,
    payload?.data,
    payload?.items,
    payload?.notifications,
    payload,
  ];

  const match = collections.find(Array.isArray);
  return Array.isArray(match) ? match : [];
};

const getDetailPayload = (payload: any) =>
  payload?.data?.item ||
  payload?.data?.notification ||
  payload?.data ||
  payload;

const toNotificationItem = (item: any, index: number): NotificationItem => {
  const id = String(
    item?.id || item?.Id || item?._id || `notification-${index}`
  );
  const title =
    item?.title ||
    item?.Title ||
    item?.subject ||
    item?.Subject ||
    item?.heading ||
    item?.Heading ||
    'Notification';
  const message =
    item?.message ||
    item?.Message ||
    item?.body ||
    item?.Body ||
    item?.description ||
    item?.Description ||
    '';
  const createdAt =
    item?.createdAt ||
    item?.CreatedAt ||
    item?.date ||
    item?.Date ||
    item?.sentAt ||
    item?.updatedAt;
  const readState =
    item?.isRead ??
    item?.read ??
    item?.IsRead ??
    item?.Read ??
    item?.status === 'read';
  const category =
    item?.type || item?.Type || item?.category || item?.Category || 'general';

  return {
    id,
    title,
    message,
    createdAt,
    isRead: Boolean(readState),
    category: String(category).toLowerCase(),
    raw: item,
  };
};

const getRelativeTime = (value: string | undefined, t: any) => {
  if (!value) {
    return t('relativeTime.recently');
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return t('relativeTime.recently');
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return t('relativeTime.justNow');
  if (diffMinutes < 60)
    return `${diffMinutes} ${t(
      diffMinutes > 1 ? 'relativeTime.minutes' : 'relativeTime.minute'
    )}`;
  if (diffHours < 24)
    return `${diffHours} ${t(
      diffHours > 1 ? 'relativeTime.hours' : 'relativeTime.hour'
    )}`;
  if (diffDays === 1) return t('relativeTime.yesterday');
  if (diffDays < 7) return `${diffDays} ${t('relativeTime.days')}`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getSectionLabel = (value: string | undefined, t: any) => {
  if (!value) return t('groups.earlier');

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t('groups.earlier');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.floor(
    (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return t('groups.today');
  if (diffDays < 7) return t('groups.thisWeek');
  return t('groups.earlier');
};

function NotificationTypeIcon({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  const hint = `${category} ${title}`.toLowerCase();

  if (hint.includes('approved') || hint.includes('success')) {
    return <FiCheckCircle />;
  }
  if (hint.includes('interview') || hint.includes('schedule')) {
    return <FiCalendar />;
  }
  if (hint.includes('deadline') || hint.includes('reminder')) {
    return <FiClock />;
  }
  if (hint.includes('application') || hint.includes('grant')) {
    return <FiFileText />;
  }

  return <FiBell />;
}

export default function Notifications() {
  const { t } = useTranslation('notifications');
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'announcements'>(
    'notifications'
  );
  const {
    data: notificationsResponse,
    isLoading: isLoadingNotifs,
    isFetching: isFetchingNotifs,
    error: errorNotifs,
    refetch: refetchNotifs,
  } = useGetNotificationsQuery({});

  const {
    data: announcementsResponse,
    isLoading: isLoadingAnn,
    isFetching: isFetchingAnn,
    error: errorAnn,
    refetch: refetchAnn,
  } = useGetAnnouncementsQuery(undefined);

  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useReadAllNotificationMutation();
  const [markOneRead, { isLoading: isMarkingOneRead }] =
    useReadNotificationByIdMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const rawNotifications = useMemo(
    () => getCollection(notificationsResponse).map(toNotificationItem),
    [notificationsResponse]
  );

  const rawAnnouncements = useMemo(() => {
    const list = getCollection(announcementsResponse);
    return list.map((item: any, idx: number) => ({
      ...toNotificationItem(item, idx),
      category: 'announcement',
      isRead: true,
    }));
  }, [announcementsResponse]);

  const notifications =
    activeTab === 'notifications' ? rawNotifications : rawAnnouncements;
  const isLoading =
    activeTab === 'notifications' ? isLoadingNotifs : isLoadingAnn;
  const isFetching =
    activeTab === 'notifications' ? isFetchingNotifs : isFetchingAnn;
  const error = activeTab === 'notifications' ? errorNotifs : errorAnn;
  const refetch = activeTab === 'notifications' ? refetchNotifs : refetchAnn;

  const selectedNotification =
    notifications.find((item) => item.id === selectedId) || null;

  const { data: notificationDetailResponse, isFetching: isDetailLoading } =
    useGetNotificationByIdQuery(
      { id: activeTab === 'notifications' ? selectedId : undefined },
      {
        skip: !selectedId || activeTab !== 'notifications',
      }
    );

  const detailPayload = selectedId
    ? getDetailPayload(notificationDetailResponse)
    : null;
  const hasNotifications = notifications.length > 0;
  const unreadCount = rawNotifications.filter((item) => !item.isRead).length;

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {
      [t('groups.today')]: [],
      [t('groups.thisWeek')]: [],
      [t('groups.earlier')]: [],
    };

    notifications.forEach((item) => {
      groups[getSectionLabel(item.createdAt, t)].push(item);
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [notifications, t]);

  const openNotification = async (item: NotificationItem) => {
    setSelectedId(item.id);

    if (activeTab === 'notifications' && !item.isRead) {
      try {
        await markOneRead({ id: item.id }).unwrap();
      } catch {
        toast.error(t('markReadError'));
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({}).unwrap();
      toast.success(t('markAllReadSuccess'));
    } catch {
      toast.error(t('markAllReadError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification({ id }).unwrap();
      if (selectedId === id) {
        setSelectedId(null);
      }
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('deleteError'));
    }
  };

  const detailTitle =
    detailPayload?.title ||
    detailPayload?.Title ||
    selectedNotification?.title ||
    t('detailTitle');
  const detailMessage =
    detailPayload?.message ||
    detailPayload?.Message ||
    detailPayload?.body ||
    detailPayload?.description ||
    selectedNotification?.message ||
    t('noDetails');
  const detailCreatedAt =
    detailPayload?.createdAt ||
    detailPayload?.CreatedAt ||
    detailPayload?.date ||
    selectedNotification?.createdAt;

  return (
    <div className="notifications-page">
      <div
        className={`notifications-shell ${
          !hasNotifications ? 'empty-view' : ''
        }`}
      >
        <section className="notifications-main-card">
          <header className="notifications-hero">
            <div className="notifications-hero-top">
              <button
                type="button"
                className="icon-button ghost"
                onClick={() => navigate(-1)}
              >
                <FiChevronLeft />
              </button>
              <div className="notifications-hero-copy">
                <div className="hero-tabs">
                  <h1
                    className={activeTab === 'notifications' ? 'active' : ''}
                    onClick={() => {
                      setActiveTab('notifications');
                      setSelectedId(null);
                    }}
                  >
                    {t('tabs.notifications')}
                  </h1>
                  <h1
                    className={activeTab === 'announcements' ? 'active' : ''}
                    onClick={() => {
                      setActiveTab('announcements');
                      setSelectedId(null);
                    }}
                  >
                    {t('tabs.announcements')}
                  </h1>
                </div>
                <p>
                  {activeTab === 'notifications'
                    ? t('subtitle')
                    : t('announcements.subtitle')}
                </p>
              </div>
              <button
                type="button"
                className="icon-button ghost"
                onClick={() => navigate('/dashboard/profile/settings')}
                title="Open settings"
              >
                <FiSettings />
              </button>
            </div>

            <div className="notifications-toolbar">
              <div className="notification-stats">
                <div className="stat-pill">
                  <FiInbox className="stat-icon-mini" />
                  <span className="stat-value">{notifications.length}</span>
                  <span className="stat-label">{t('total')}</span>
                </div>
                <div
                  className={`stat-pill ${unreadCount > 0 ? 'highlight' : ''}`}
                >
                  <FiBell className="stat-icon-mini" />
                  <span className="stat-value">{unreadCount}</span>
                  <span className="stat-label">{t('unread')}</span>
                </div>
              </div>

              <div className="notification-actions">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => refetch()}
                >
                  <FiRefreshCw />
                  {t('refresh')}
                </button>
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleMarkAllRead}
                  disabled={
                    activeTab !== 'notifications' ||
                    !hasNotifications ||
                    unreadCount === 0 ||
                    isMarkingAllRead
                  }
                >
                  <FiEye />
                  {t('markAllRead')}
                </button>
              </div>
            </div>
          </header>

          <div className="notifications-content">
            {isLoading || isFetching ? (
              <div className="notifications-state loading">
                <div className="state-spinner" />
                <h2>{t('loading')}</h2>
                <p>{t('loadingDesc')}</p>
              </div>
            ) : error ? (
              <div className="notifications-state error">
                <div className="state-icon">
                  <FiBell />
                </div>
                <h2>{t('errorTitle')}</h2>
                <p>{t('errorDesc')}</p>
                <button
                  type="button"
                  className="primary-action"
                  onClick={() => refetch()}
                >
                  <FiRefreshCw />
                  {t('tryAgain')}
                </button>
              </div>
            ) : !hasNotifications ? (
              <div className="notifications-state empty">
                <div className="state-icon">
                  <FiInbox />
                </div>
                <h2>
                  {activeTab === 'notifications'
                    ? t('noNotifications')
                    : t('announcements.noAnnouncements')}
                </h2>
                <p>
                  {activeTab === 'notifications'
                    ? t('noNotificationsDesc')
                    : t('announcements.noAnnouncementsDesc')}
                </p>
                {activeTab === 'notifications' && (
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => navigate('/dashboard/galas')}
                  >
                    {t('exploreGalas')}
                    <FiArrowRight />
                  </button>
                )}
              </div>
            ) : (
              <div className="notifications-list-wrap">
                {groupedNotifications.map(([label, items]) => (
                  <div className="notification-group" key={label}>
                    <div className="notification-group-label">{label}</div>
                    <div className="notification-group-list">
                      {items.map((item) => (
                        <article
                          key={item.id}
                          className={`notification-row ${
                            item.isRead ? 'read' : 'unread'
                          } ${selectedId === item.id ? 'selected' : ''}`}
                          onClick={() => openNotification(item)}
                        >
                          <div
                            className={`notification-icon ${
                              item.isRead ? '' : 'active'
                            }`}
                          >
                            <NotificationTypeIcon
                              category={item.category}
                              title={item.title}
                            />
                          </div>

                          <div className="notification-copy">
                            <div className="notification-copy-top">
                              <h3>{item.title}</h3>
                              {!item.isRead && (
                                <span className="notification-dot" />
                              )}
                            </div>
                            <p>{item.message || t('noDetails')}</p>
                            <span>{getRelativeTime(item.createdAt, t)}</span>
                          </div>

                          {activeTab === 'notifications' && (
                            <button
                              type="button"
                              className="row-delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(item.id);
                              }}
                              disabled={isDeleting}
                              title="Delete notification"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {hasNotifications && (
          <aside
            className={`notifications-detail-card ${selectedId ? 'open' : ''}`}
          >
            <div className="detail-card-header">
              <div>
                <h2>{t('detailTitle')}</h2>
                <p>{t('detailSubtitle')}</p>
              </div>
              <button
                type="button"
                className="icon-button subtle"
                onClick={() => setSelectedId(null)}
              >
                <FiX />
              </button>
            </div>

            {!selectedId ? (
              <div className="detail-empty">
                <div className="detail-empty-icon">
                  <FiBell />
                </div>
                <h3>{t('selectPrompt')}</h3>
                <p>{t('selectPromptDesc')}</p>
              </div>
            ) : (
              <div className="detail-body">
                <div className="detail-badge">
                  <NotificationTypeIcon
                    category={selectedNotification?.category || 'general'}
                    title={detailTitle}
                  />
                  <span>
                    {selectedNotification?.isRead
                      ? t('statusRead')
                      : t('statusNew')}
                  </span>
                </div>

                <h3>{detailTitle}</h3>
                <div className="detail-time">
                  {getRelativeTime(detailCreatedAt, t)}
                </div>

                <div className="detail-message">
                  {isDetailLoading ? (
                    <p>{t('loadingMessage')}</p>
                  ) : (
                    <p>{detailMessage}</p>
                  )}
                </div>

                <div className="detail-meta">
                  <div className="meta-row">
                    <span>{t('statusLabel')}</span>
                    <strong>
                      {selectedNotification?.isRead
                        ? t('statusRead')
                        : t('unread')}
                    </strong>
                  </div>
                  <div className="meta-row">
                    <span>{t('dateLabel')}</span>
                    <strong>
                      {detailCreatedAt
                        ? new Date(detailCreatedAt).toLocaleString('en-GB')
                        : t('relativeTime.recently')}
                    </strong>
                  </div>
                </div>

                <div className="detail-actions">
                  {activeTab === 'notifications' && (
                    <button
                      type="button"
                      className="secondary-action danger"
                      onClick={() => selectedId && handleDelete(selectedId)}
                      disabled={isDeleting}
                    >
                      <FiTrash2 />
                      {t('delete')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {(isMarkingOneRead || isDeleting) && (
        <div className="notifications-floating-status">{t('updating')}</div>
      )}
    </div>
  );
}
