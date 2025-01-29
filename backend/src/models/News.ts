import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface NewsAttributes {
  id: number;
  title: string;
  content?: string | null;
  rank: "Basic" | "Intermediate" | "Advanced" | "Elite" | "Legendary";
  locked?: boolean | null;
  created_at?: Date | null;
  url?: string | null;
}

type NewsCreationAttributes = Optional<NewsAttributes, "id" | "locked" | "created_at" | "url">;

class News extends Model<NewsAttributes, NewsCreationAttributes> implements NewsAttributes {
  public id!: number;
  public title!: string;
  public content?: string | null;
  public rank!: "Basic" | "Intermediate" | "Advanced" | "Elite" | "Legendary";
  public locked?: boolean | null;
  public created_at?: Date | null;
  public url?: string | null;
}

News.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT },
    rank: {
      type: DataTypes.ENUM("Basic", "Intermediate", "Advanced", "Elite", "Legendary"),
      allowNull: false,
    },
    locked: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    url: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "news",
    timestamps: false,
  },
);

export default News;
