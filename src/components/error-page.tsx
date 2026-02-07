const ErrorPage = ({ page }: { page: string }) => {
  return (
    <div className="p-8 text-center text-red-500">
      Gagal memuat data {page}.
    </div>
  )
}

export default ErrorPage
