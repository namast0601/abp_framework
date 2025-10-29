using Volo.Abp.Application.Dtos;

namespace Acme.BookStore.Author;

public class GetAuthorListDto : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
}