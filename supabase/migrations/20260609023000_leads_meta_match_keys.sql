-- Meta CAPI match keys captured at lead submit, replayed on Schedule webhook

alter table leads add column if not exists meta_fbp text;
alter table leads add column if not exists meta_fbc text;
alter table leads add column if not exists meta_fbc_ts bigint;
alter table leads add column if not exists meta_client_ip text;
alter table leads add column if not exists meta_client_user_agent text;

comment on column leads.meta_fbp is 'Meta _fbp at lead submit — replayed on Schedule CAPI';
comment on column leads.meta_fbc is 'Meta _fbc at lead submit — replayed on Schedule CAPI';
comment on column leads.meta_fbc_ts is 'Landing ms timestamp used to synthesize _fbc';
comment on column leads.meta_client_ip is 'Client IP at lead submit for Meta CAPI match';
comment on column leads.meta_client_user_agent is 'User-Agent at lead submit for Meta CAPI match';
