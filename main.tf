resource "aws_vpc" "snack_bar_payments_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "snack-bar-payments-vpc"
  }
}

resource "aws_subnet" "snack_bar_payments_subnet_1" {
  vpc_id            = aws_vpc.snack_bar_payments_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "snack-bar-payments-subnet-1"
  }
}

resource "aws_subnet" "snack_bar_payments_subnet_2" {
  vpc_id            = aws_vpc.snack_bar_payments_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "snack-bar-payments-subnet-2"
  }
}

resource "aws_internet_gateway" "snack_bar_payments_igw" {
  vpc_id = aws_vpc.snack_bar_payments_vpc.id

  tags = {
    Name = "snack-bar-payments-igw"
  }
}

resource "aws_route_table" "snack_bar_payments_route_table" {
  vpc_id = aws_vpc.snack_bar_payments_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.snack_bar_payments_igw.id
  }

  tags = {
    Name = "snack-bar-payments-route-table"
  }
}

resource "aws_route_table_association" "snack_bar_payments_rta_1" {
  subnet_id      = aws_subnet.snack_bar_payments_subnet_1.id
  route_table_id = aws_route_table.snack_bar_payments_route_table.id
}

resource "aws_route_table_association" "snack_bar_payments_rta_2" {
  subnet_id      = aws_subnet.snack_bar_payments_subnet_2.id
  route_table_id = aws_route_table.snack_bar_payments_route_table.id
}

# EKS cluster setup
resource "aws_eks_cluster" "snack_bar_payments_eks" {
  name     = "snack-bar-payments-cluster"
  role_arn = "arn:aws:iam::083022795774:role/LabRole"

  vpc_config {
    subnet_ids = [aws_subnet.snack_bar_payments_subnet_1.id, aws_subnet.snack_bar_payments_subnet_2.id]
  }
}

# EKS worker node group using LabRole
resource "aws_eks_node_group" "snack_bar_payments_worker_group" {
  cluster_name    = aws_eks_cluster.snack_bar_payments_eks.name
  node_group_name = "snack-bar-payments-worker-group"
  node_role_arn   = "arn:aws:iam::083022795774:role/LabRole"
  subnet_ids      = [aws_subnet.snack_bar_payments_subnet_1.id, aws_subnet.snack_bar_payments_subnet_2.id]

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }

  depends_on = [
    aws_eks_cluster.snack_bar_payments_eks
  ]
}

# MongoDB
resource "aws_docdb_cluster" "snack_bar_payments_mongo" {
  cluster_identifier = "snack-bar-payments-mongo-cluster"
  engine             = "docdb"
  master_username    = "mongoAdmin"
  master_password    = "SecurePassword123!"
  backup_retention_period = 7

  tags = {
    Name = "snack-bar-payments-mongo"
  }
}

resource "aws_docdb_cluster_instance" "snack_bar_payments_mongo_instance" {
  count              = 2
  cluster_identifier = aws_docdb_cluster.snack_bar_payments_mongo.id
  instance_class     = "db.r5.large"

  tags = {
    Name = "snack-bar-payments-mongo-instance"
  }
}
