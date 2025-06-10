-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.category (
  id text NOT NULL,
  name text NOT NULL,
  startId text NOT NULL,
  endId text NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.manager_table (
  id text NOT NULL,
  tableId integer NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  status text NOT NULL DEFAULT 'available'::text,
  CONSTRAINT manager_table_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order (
  id text NOT NULL,
  tableId text,
  total double precision NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::order_status,
  deliveryMethod USER-DEFINED NOT NULL DEFAULT 'PICKUP'::delivery_method,
  deliveryAddress text,
  customerName text NOT NULL,
  customerEmail text NOT NULL,
  customerPhone text NOT NULL,
  note text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT order_pkey PRIMARY KEY (id),
  CONSTRAINT order_tableId_fkey FOREIGN KEY (tableId) REFERENCES public.manager_table(id)
);
CREATE TABLE public.order_item (
  id text NOT NULL,
  orderId text NOT NULL,
  productId text NOT NULL,
  title text NOT NULL,
  quantity integer NOT NULL,
  price double precision NOT NULL,
  size text,
  milk text,
  drink text,
  toppings jsonb NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT order_item_pkey PRIMARY KEY (id),
  CONSTRAINT order_item_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.order(id),
  CONSTRAINT order_item_productId_fkey FOREIGN KEY (productId) REFERENCES public.product(id)
);
CREATE TABLE public.payment (
  id text NOT NULL,
  orderId text,
  webOrderId text,
  amount double precision NOT NULL,
  paymentMethod USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::payment_status,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT payment_pkey PRIMARY KEY (id),
  CONSTRAINT payment_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.order(id),
  CONSTRAINT payment_webOrderId_fkey FOREIGN KEY (webOrderId) REFERENCES public.web_order(id)
);
CREATE TABLE public.product (
  id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price double precision NOT NULL,
  originalPrice double precision,
  rating double precision NOT NULL,
  reviews integer NOT NULL,
  image text NOT NULL,
  categoryId text NOT NULL,
  sizes jsonb NOT NULL,
  milkOptions jsonb NOT NULL,
  drinkOptions jsonb NOT NULL,
  toppings jsonb NOT NULL,
  basePrices jsonb NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT product_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES public.category(id)
);
CREATE TABLE public.web_order (
  id text NOT NULL,
  total double precision NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::order_status,
  deliveryMethod USER-DEFINED NOT NULL DEFAULT 'PICKUP'::delivery_method,
  deliveryAddress text,
  customerName text NOT NULL,
  customerEmail text NOT NULL,
  customerPhone text NOT NULL,
  note text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT web_order_pkey PRIMARY KEY (id)
);
CREATE TABLE public.web_order_item (
  id text NOT NULL,
  orderId text NOT NULL,
  productId text NOT NULL,
  quantity integer NOT NULL,
  price double precision NOT NULL,
  size text,
  milk text,
  drink text,
  toppings ARRAY,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT web_order_item_pkey PRIMARY KEY (id),
  CONSTRAINT web_order_item_productId_fkey FOREIGN KEY (productId) REFERENCES public.product(id),
  CONSTRAINT web_order_item_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.web_order(id)
);