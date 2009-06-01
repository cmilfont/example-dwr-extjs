package org.milfont;

import java.util.List;

import javax.servlet.http.HttpSession;

public class AjaxFacade {

	private Repository repository = null;
	
	public void setRepository(Repository repository) {
		this.repository = repository;
	}

	public DataTransferObject find(Object filter, int start, int limit, boolean cache, HttpSession session) {
		DataTransferObject dto = new DataTransferObject();

		if (cache) {
			Integer total = (Integer) session.getAttribute("totalObject");
			dto.setTotal(total);
		} else {
			session.removeAttribute("totalObject");
			Integer total = repository.count(filter);
			dto.setTotal(total);
			session.setAttribute("totalObject", total);
		}
		List<Object> retorno = (List<Object>) repository.find(filter, start, limit);
		dto.setResults(retorno);

		return dto;
	}
	
	public DataTransferObject teste(Project teste) {
		DataTransferObject dto = new DataTransferObject();
		return dto;
	}
}
