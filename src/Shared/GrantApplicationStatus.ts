export enum GrantApplicationStatus {
  Draft = 1,
  Pending = 2,
  InReview = 3,
  Approved = 4,
  Rejected = 5,
  Winner = 6,
  ApprovedForInterview = 7,
}

export const getGrantApplicationStatusValue = (application: any) =>
  Number(application?.status ?? application?.Status);

export const getGrantApplicationStatusLabel = (status: any) => {
  if (typeof status === 'string') {
    return status;
  }

  switch (Number(status)) {
    case GrantApplicationStatus.Draft:
      return 'Draft';
    case GrantApplicationStatus.Pending:
      return 'Pending';
    case GrantApplicationStatus.InReview:
      return 'In Review';
    case GrantApplicationStatus.Approved:
      return 'Approved';
    case GrantApplicationStatus.Rejected:
      return 'Rejected';
    case GrantApplicationStatus.Winner:
      return 'Winner';
    case GrantApplicationStatus.ApprovedForInterview:
      return 'Approved For Interview';
    default:
      return 'Pending';
  }
};

export const isGrantApprovedStatus = (status: number) =>
  [
    GrantApplicationStatus.Approved,
    GrantApplicationStatus.Winner,
    GrantApplicationStatus.ApprovedForInterview,
  ].includes(status);

export const isGrantPendingStatus = (status: number) =>
  [
    GrantApplicationStatus.Pending,
    GrantApplicationStatus.InReview,
  ].includes(status);
