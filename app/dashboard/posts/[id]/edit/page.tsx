export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Edit Post: {params.id}</h1>
      <p className="text-slate-600">
        Placeholder for the edit post form.
      </p>
    </div>
  );
}
