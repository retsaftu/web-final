// components/CategoryList.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Folder, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

interface CategoryFormData {
  name: string;
  description: string;
}

export const CategoryList: React.FC = () => {
  const {
    categories,
    courses,
    isLoading,
    error,
    fetchCategories,
    createCategory,
  } = useStore();

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  // Получаем количество курсов для каждой категории
  const getCourseCount = (categoryId: number) => {
    return courses.filter((course) => course.category === categoryId).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(formData);
      toast({
        title: "Category created",
        description: "New category has been created successfully.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchCategories(); // Обновляем список категорий
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{"Create New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Category description"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{"Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {category.name}
              </CardTitle>
              <Folder className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-1" />
                {getCourseCount(category.id)} courses
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2"></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
